import os
import uuid
import shutil
import random
import httpx
import cv2
import numpy as np
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, UploadFile, Form, HTTPException, File, Query, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from inference_sdk import InferenceHTTPClient
import google.generativeai as genai
from dotenv import load_dotenv
import traceback
from typing import Optional
import threading



load_dotenv()

app = FastAPI(
    title="HCC_AI_BACKEND API",
    description=(
        "Esta es la API backend del proyecto HCC-AI, encargada de proporcionar servicios fundamentales "
        "como análisis de imágenes mediante IA, segmentación automática, generación de informes clínicos, "
        "asistencia médica con IA generativa y manejo de correos electrónicos para notificaciones y reportes. "
        "Está diseñada para integrarse con el frontend y facilitar el funcionamiento integral de la plataforma."
    ),
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Detected-Labels", "X-Confidence-Threshold"], 
)


# --- Backend AI_MODELS_BACKEND (modelos de clasificación HCC-AI y METAVIR-AI) ---

AI_MODEL_BACKEND_URL = os.getenv("AI_MODEL_BACKEND_URL")


# --- Cliente de Roboflow (modelo de segmentación SEGMENTADOR_HEPÁTICO-AI)---
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key=os.getenv("ROBOFLOW_API_KEY"),
)


# --- BaseModels ---

class ContactForm(BaseModel):
    """
    Modelo para el formulario de contacto

    - **name**: Nombre del usuario que envía el mensaje
    - **email**: Correo electrónico del usuario
    - **message**: Contenido del mensaje
    """
    name: str
    email: str
    message: str

class AssistantQuery(BaseModel):
    """
    Modelo para las preguntas al asistente de IA

    - **instruction**: Instrucción o pregunta para el asistente
    - **input_text**: Texto adicional opcional para contexto
    """
    instruction: str
    input_text: str = ""

class ExplainResultsRequest(BaseModel):
    """
    Modelo para solicitar explicación médica de resultados

    - **predicted_class**: Clase predicha por el modelo
    - **model_name**: Nombre del modelo usado (opcional)
    - **labels**: Lista de etiquetas detectadas en la imagen
    """
    predicted_class: str
    model_name: Optional[str] = None
    labels: list[str] = []



# --- Función de envío de email ---
def send_email(name: str, email: str, message: str):
    sender_email = os.getenv("SENDER_EMAIL", "noreply.hccai@gmail.com")
    receiver_email = os.getenv("RECEIVER_EMAIL", "marcos.rivkyo@gmail.com")
    password = os.getenv("EMAIL_PASSWORD")

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = "Nuevo mensaje de contacto"
    body = f"Nombre: {name}\nCorreo: {email}\n\nMensaje:\n{message}"
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar el mensaje: {str(e)}")


def send_email_to_patient(name: str, email: str, message: str):
    sender_email = os.getenv("SENDER_EMAIL", "noreply.hccai@gmail.com")
    password = os.getenv("EMAIL_PASSWORD")

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = email  
    msg["Subject"] = "Informe de HCC-AI"

    body = f"Hola,\n\n{name} ha compartido un informe contigo desde HCC-AI.\n\n{message}\n\nSaludos,\nEquipo HCC-AI"
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, email, msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar el mensaje: {str(e)}")




@app.post(
    "/send-email/",
    summary="Enviar mensaje desde formulario de contacto",
    response_description="Confirmación del envío del mensaje",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Mensaje enviado correctamente."},
        500: {"description": "Error al enviar el mensaje."},
    },
)
async def send_message(contact: ContactForm):
    """
    Envía un correo electrónico con los datos proporcionados en el formulario de contacto.

    - **name**: Nombre del remitente.
    - **email**: Correo electrónico del remitente.
    - **message**: Contenido del mensaje.

    Retorna un mensaje de éxito si el correo fue enviado correctamente.
    En caso de error, retorna un HTTP 500 con detalle del problema.
    """
    try:
        send_email(contact.name, contact.email, contact.message)
        return {"message": "Correo enviado correctamente."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post(
    "/send-report",
    summary="Enviar informe médico al remitente por correo",
    response_description="Confirmación del envío del correo",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Correo con informe enviado correctamente al destinatario."},
        500: {"description": "Error al enviar el correo al destinatario."},
    },
)
async def send_report_to_patient(form: ContactForm):
    """
    Envía un correo electrónico al paciente con un informe clínico compartido.

    - **name**: Nombre del médico o remitente.
    - **email**: Correo electrónico del paciente destinatario.
    - **message**: Mensaje personalizado que acompaña al informe.

    Retorna un mensaje de confirmación si el correo fue enviado correctamente.
    En caso de error, retorna un HTTP 500 con detalle del problema.
    """
    try:
        send_email_to_patient(form.name, form.email, form.message)
        return {"message": "Correo enviado correctamente al destinatario."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# --- Predicción de la imagen con Modelo IA ---

async def get_prediction_from_ai_model_backend(file: UploadFile, model_name: str):
    try:
        async with httpx.AsyncClient() as client:
            form_data = {"model_name": model_name}
            files = {"file": (file.filename, file.file, "application/octet-stream")}
            response = await client.post(AI_MODEL_BACKEND_URL, data=form_data, files=files)
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail="Error al obtener la predicción del backend AI")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con el backend AI: {e}")


@app.post(
    "/predict-classification/",
    summary="Predicción de clasificación para imagen médica",
    response_description="Resultado de la predicción del modelo de IA",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Predicción realizada correctamente"},
        500: {"description": "Error al conectar o procesar la imagen en el backend de IA"},
    },
)

async def predict(
    file: UploadFile = File(..., description="Archivo de imagen ecográfica para análisis"),
    model_name: str = Form(..., description="Nombre del modelo IA de clasificación")
):
    """
    Recibe una imagen de ecografía y el nombre de un modelo de IA, 
    envía la imagen al backend de IA (AI_MODELS_BACKEND) para obtener la predicción 
    de clasificación del estado hepático.

    - **file**: Archivo de imagen (ecografía) a procesar.
    - **model_name**: Nombre del modelo de IA a utilizar para la predicción.

    Retorna un JSON con el resultado de la predicción si la solicitud es exitosa.
    En caso de error, retorna un mensaje detallado con código HTTP 500.
    """    

    try:
        prediction_result = await get_prediction_from_ai_model_backend(file, model_name)
        return prediction_result
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error en la predicción: {e}"})


import base64


@app.post(
    "/segment/",
    summary="Segmentación y anotación de imagen ecográfica hepática",
    response_description="Imagen segmentada y etiquetas detectadas",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Segmentación realizada con éxito"},
        400: {"description": "Error al cargar la imagen"},
        500: {"description": "Error interno en el servidor"},
    },
)
async def segment_image(
    file: UploadFile = File(..., description="Archivo de imagen ecográfica"),
    confidence_threshold: float = Query(0.5, ge=0.0, le=1.0, description="Umbral mínimo de confianza para filtrado (0.0 a 1.0)")
):
    """
    Este endpoint recibe una imagen ecográfica y un umbral de confianza,
    realiza la segmentación y anotación automática de estructuras hepáticas
    mediante un modelo creado en Roboflow.
    
    - **file**: Imagen de ecografía en formato JPEG o PNG.
    - **confidence_threshold**: Umbral mínimo de confianza para mostrar predicciones (0.0 a 1.0).

    Devuelve la imagen segmentada, con etiquetas detectadas y el umbral usado.
    """
    temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = CLIENT.infer(temp_filename, model_id="liver_ultrasound-phwos/1")
    image = cv2.imread(temp_filename)
    if image is None:
        os.remove(temp_filename)
        raise HTTPException(status_code=400, detail="No se pudo cargar la imagen.")

    def get_bright_color():
        return tuple(random.randint(128, 255) for _ in range(3))

    detected_labels = set()

    for prediction in result["predictions"]:
        confidence = prediction["confidence"]
        if confidence < confidence_threshold:
            continue

        x, y = prediction["x"], prediction["y"]
        width, height = prediction["width"], prediction["height"]
        class_name = prediction["class"]
        detected_labels.add(class_name)

        x1 = int(x - width / 2)
        y1 = int(y - height / 2)
        x2 = int(x + width / 2)
        y2 = int(y + height / 2)

        color = get_bright_color()
        cv2.rectangle(image, (x1, y1), (x2, y2), color, thickness=3)

        confidence_text = f"{class_name}: {confidence * 100:.2f}%"
        font = cv2.FONT_HERSHEY_SIMPLEX
        (text_width, text_height), _ = cv2.getTextSize(confidence_text, font, 0.8, 2)
        cv2.rectangle(image, (x1, y1 - text_height - 6), (x1 + text_width, y1), (0, 0, 0), -1)
        cv2.putText(image, confidence_text, (x1, y1 - 4), font, 0.8, color, 2)

    _, img_encoded = cv2.imencode(".jpg", image)
    base64_image = base64.b64encode(img_encoded).decode("utf-8")
    os.remove(temp_filename)

    return {
        "image_base64": base64_image,
        "detected_labels": sorted(detected_labels),
        "confidence_threshold": confidence_threshold
    }



# --- Asistente de IA (GEMINI) ---


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")


@app.post(
    "/ask-assistant/",
    summary="Asistente médico basado en IA para enfermedades hepáticas (Chatbot)",
    response_description="Respuesta generada por el asistente médico IA",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Respuesta generada correctamente"},
        500: {"description": "Error al generar la respuesta con el modelo IA"},
    },
)

async def ask_assistant(query: AssistantQuery):
    """
    Este endpoint recibe una instrucción clínica y un texto de entrada, 
    y devuelve una respuesta generada por un modelo de lenguaje especializado 
    en enfermedades hepáticas para ayudar en la identificación de carcinoma hepatocelular (HCC).
    
    El modelo provee respuestas clínicas claras, concisas y actualizadas, integrándose con la plataforma HCC-AI.
    """    
    try:
        prompt = (
            "Eres HCC-AI Assistant, un asistente médico especializado en enfermedades hepáticas, "
            "integrado en la aplicación HCC-AI.\n"
            "Tu deber es ayudar al médico a identificar posibles casos de carcinoma hepatocelular (HCC) "
            "y proporcionar respuestas clínicas claras, concisas y basadas en conocimientos médicos actualizados.\n"
            f"### Instrucción:\n{query.instruction}\n"
            f"### Entrada:\n{query.input_text}\n"
            "### Respuesta:"
        )


        response = model.generate_content(prompt)
        return {"respuesta": response.text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar respuesta con Gemini: {str(e)}")
    

@app.post(
    "/explain-results/",
    summary="Genera explicación médica para resultados de clasificación hepática",
    response_description="Explicación médica generada por el asistente IA",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Explicación generada correctamente"},
        500: {"description": "Error al generar la explicación"},
    },
)

async def explain_results(request: ExplainResultsRequest):
    """
    Este endpoint recibe la clase predicha y las etiquetas segmentadas de una imagen hepática,
    y utiliza un modelo generativo para producir una explicación médica estructurada en tres bloques:
    1) Breve explicación médica del hallazgo.
    2) Posibles tratamientos o manejo habitual.
    3) Recomendación clínica inmediata (estudios adicionales, derivación, monitoreo).

    La explicación es educativa y no sustituye el juicio médico profesional.
    """    
    try:
        predicted_class_str = str(request.predicted_class)

        modelo = "METAVIR-AI" if str(request.predicted_class).startswith("F") else "HCC-AI"


        label_descriptions = {
            "LVR": "Hígado", "HCC": "Carcinoma hepatocelular", "BND": "Banda de fibrosis", "VSL": "Vasos sanguíneos",
            "HV": "Vena hepática", "IVC": "Vena cava inferior", "K": "Riñón", "K-C": "Corteza renal", "K-M": "Médula renal",
            "TRANS": "Corte transversal", "PV": "Vena porta", "SAG": "Corte sagital", "SAG K": "Corte sagital renal",
            "LT SAG": "Lóbulo izquierdo (sagital)", "RT TRANS": "Lóbulo derecho (transversal)"
        }

        if request.labels:
            etiquetas = "\n".join([
                f"- {label}: {label_descriptions.get(label, 'Descripción no disponible')}"
                for label in request.labels
            ])
        else:
            etiquetas = "No se detectaron estructuras segmentadas en la imagen."

        prompt = (
            "Eres HCC-AI Assistant, un asistente médico especializado en enfermedades hepáticas.\n"
            f"Modelo de clasificación usado: {modelo}\n"
            f"Resultado predicho: {predicted_class_str}\n"
            f"Estructuras segmentadas:\n{etiquetas}\n\n"
            "Devuelve tres bloques bien diferenciados:\n"
            "1) Breve explicación médica del hallazgo\n"
            "2) Posibles tratamientos o manejo habitual\n"
            "3) Recomendación clínica inmediata (como estudios adicionales, derivación o monitoreo)\n\n"
            "Sé preciso, conciso y evita repetir información obvia.\n\n"
            "**IMPORTANTE:** Esta explicación es generada automáticamente con fines exclusivamente educativos y **no reemplaza el criterio médico profesional**. "
            "Ante cualquier duda, siempre se debe consultar con un especialista."
        )


        response = model.generate_content(prompt)

        return {"explicacion": response.text.strip()}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al generar explicación: {str(e)}")




def pre_recortar_imagen(img, porcentaje=0.15):
    """Recorta un porcentaje de los bordes de la imagen."""
    h, w, _ = img.shape
    delta_h, delta_w = int(h * porcentaje), int(w * porcentaje)
    return img[delta_h:h-delta_h, delta_w:w-delta_w]

def redimensionar_imagen(img, tamano_objetivo):
    """Redimensiona la imagen al tamaño objetivo."""
    return cv2.resize(img, tamano_objetivo)

def procesar_ecografia(image_path, output_path):
    """Detecta automáticamente la región de la ecografía, anonimiza y normaliza."""
    TAMANIO_OBJETIVO = (512, 512)

    img = cv2.imread(image_path)
    if img is None:
        print(f"[ERROR] No se pudo cargar la imagen: {image_path}")
        return

    original = img.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("[WARN] No se encontraron contornos relevantes.")
        return

    largest_contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest_contour)

    margin = 10
    x = max(x - margin, 0)
    y = max(y - margin, 0)
    w = min(w + 2 * margin, img.shape[1] - x)
    h = min(h + 2 * margin, img.shape[0] - y)

    img_crop = original[y:y+h, x:x+w]

    img_gray = cv2.cvtColor(img_crop, cv2.COLOR_BGR2GRAY)
    img_blur = cv2.GaussianBlur(img_gray, (5, 5), 0)
    img_norm = cv2.normalize(img_blur, None, 0, 255, cv2.NORM_MINMAX)

    img_final = cv2.resize(img_norm, TAMANIO_OBJETIVO)
    img_final = img_final.astype('float32') / 255.0
    img_final = np.repeat(img_final[..., np.newaxis], 3, axis=-1)

    cv2.imwrite(output_path, img_final * 255)

@app.post(
    "/anonymize-ultrasound/",
    summary="Procesa y anonimiza ecografías hepáticas",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Imagen de ecografía procesada y anonimizada"},
        400: {"description": "Error al cargar la imagen"},
        500: {"description": "Error interno procesando la imagen"},
    },
)
async def anonymize_ultrasound(file: UploadFile = File(...)):
    """
    Recibe una imagen de ecografía hepática, detecta automáticamente la región útil,
    la anonimiza y normaliza, y devuelve la imagen procesada.

    Se usa para preparar imágenes para análisis posteriores asegurando confidencialidad y calidad.

    Retorna la imagen procesada en formato JPEG.
    """    
    input_path = f"temp_input_{uuid.uuid4().hex}.jpg"
    output_path = f"temp_output_{uuid.uuid4().hex}.jpg"

    try:
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        procesar_ecografia(input_path, output_path)

        if not os.path.exists(output_path):
            raise HTTPException(status_code=500, detail="Error al procesar la imagen. Archivo no generado.")

        return FileResponse(
            output_path,
            media_type="image/jpeg",
            filename="anonymized_ultrasound.jpg",
            headers={"X-Processed": "true"},
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al anonimizar la ecografía: {str(e)}")

    finally:
        def remove_file(path):
            try:
                if os.path.exists(path):
                    os.remove(path)
            except Exception as cleanup_err:
                print(f"[WARN] No se pudo eliminar {path}: {cleanup_err}")

        import threading
        threading.Timer(5.0, remove_file, args=[input_path]).start()
        threading.Timer(5.0, remove_file, args=[output_path]).start()




# --- Ruta raíz ---
@app.get("/")
async def read_root():
    return {"message": "El backend HCC_AI_BACKEND está operativo!"}
