import os
import io
import json
import numpy as np
from fastapi import FastAPI, UploadFile, Form, HTTPException, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from PIL import Image

from google.cloud import storage, secretmanager
from google.oauth2 import service_account
import tensorflow.keras.backend as K


app = FastAPI(
    title="AI_MODELS_BACKEND API",
    description=(
        "Esta es la API backend para el proyecto HCC-AI que proporciona servicios de clasificación "
        "de imágenes médicas hepáticas usando modelos de inteligencia artificial entrenados. "
        "Permite subir imágenes ecográficas y obtener predicciones sobre el estado hepático "
        "utilizando modelos basados en CNNs personalizadas, Resnet y VGG16. "
    ),
    version="1.0.0"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Secret Manager -----
def get_credentials_from_secret(secret_id: str, version: str = "latest"):
    """
    Obtiene las credenciales de Google Cloud desde Secret Manager.

    - secret_id: Nombre del secreto en GCP.
    - version: Versión del secreto (por defecto "latest").

    Retorna las credenciales para autenticación.
    """
    client = secretmanager.SecretManagerServiceClient()
    project_id = os.environ["GCP_PROJECT"]
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    secret_data = response.payload.data.decode("UTF-8")
    info = json.loads(secret_data)
    credentials = service_account.Credentials.from_service_account_info(info)
    return credentials

# Cargar credenciales para Google Cloud
GOOGLE_SECRET_ID = os.environ.get("GOOGLE_SECRET_ID", "hcc-ai-credentials")
credentials = get_credentials_from_secret(GOOGLE_SECRET_ID)


# Modelos IA disponibles
MODEL_BUCKETS = {
    "resnet": ("metavir-model-resnet", "modelo_metavir_resnet.h5"),
    "efficient_net": ("hcc-ai-model-efficient", "modelo_hcc_ai_cnn.h5"),
    "VGG16": ("metavir-model-vgg", "modelo_metavir_vgg16.h5"),
}

loaded_models = {}

def sparse_categorical_focal_loss(gamma=2.0, alpha=0.25):
    """
    Función de pérdida focal para modelos con desequilibrio de clases.
    """
    def loss_fn(y_true, y_pred):
        y_true = tf.cast(y_true, tf.int32)
        y_true_one_hot = tf.one_hot(y_true, depth=y_pred.shape[-1])
        cross_entropy = -y_true_one_hot * K.log(y_pred + K.epsilon())
        weight = alpha * K.pow(1 - y_pred, gamma)
        focal_loss = weight * cross_entropy
        return K.sum(focal_loss, axis=1)
    return loss_fn


def get_storage_client():
    """
    Retorna un cliente autenticado para Google Cloud Storage.
    """
    return storage.Client(credentials=credentials, project=credentials.project_id)


def load_model_from_gcs(model_name: str):
    """
    Descarga y carga un modelo desde Google Cloud Storage si no está cargado.

    - model_name: Nombre clave del modelo ("resnet", "efficient_net", "vgg16").

    Retorna el modelo TensorFlow cargado.
    """
    if model_name in loaded_models:
        return loaded_models[model_name]

    if model_name not in MODEL_BUCKETS:
        raise HTTPException(status_code=400, detail="Modelo no válido")

    bucket_name, model_file = MODEL_BUCKETS[model_name]
    local_path = os.path.join(os.path.dirname(__file__), model_file)

    if not os.path.exists(local_path):
        client = get_storage_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(model_file)
        blob.download_to_filename(local_path)
        print(f"Modelo {model_name} descargado desde GCS.")

    model = tf.keras.models.load_model(
        local_path,
        custom_objects={'loss_fn': sparse_categorical_focal_loss(gamma=2.0)} if model_name == "efficient_net" else None
    )
    loaded_models[model_name] = model
    return model


@app.on_event("startup")
async def startup_event():
    """
    Evento de inicio para cargar todos los modelos disponibles.
    """
    for model_name in MODEL_BUCKETS.keys():
        try:
            load_model_from_gcs(model_name)
        except Exception as e:
            print(f"Error al cargar el modelo {model_name}: {e}")



async def preprocess_image(img: UploadFile):
    """
    Preprocesa la imagen para ser compatible con los modelos de IA.

    - Redimensiona a 224x224.
    - Convierte a array numpy con batch dimension.

    Retorna numpy array listo para inferencia.
    """
    try:
        image_data = await img.read()
        img_pil = Image.open(io.BytesIO(image_data)).convert("RGB")
        img_pil = img_pil.resize((224, 224))
        img_array = image.img_to_array(img_pil)
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar la imagen: {e}")
    


@app.post("/predict/")
async def predict(
    file: UploadFile = File(..., description="Archivo de imagen ecográfica para análisis"),
    model_name: str = Form(..., description="Nombre del modelo de IA a utilizar para la predicción. Opciones: 'efficient_net', 'resnet', 'vgg16'")
):
    """
    Recibe una imagen ecográfica y el nombre de uno de los tres modelos entrenados para clasificación hepática.

    Modelos disponibles:
    - **cnn**: Modelo CNN eficiente para diagnóstico HCC-AI.
    - **resnet**: Modelo basado en arquitectura ResNet para clasificación METAVIR.
    - **VGG16**: Modelo basado en VGG16 para clasificación METAVIR.
    
    Recibe:

    - **file**: Imagen de ecografía a analizar.
    - **model_name**: Nombre del modelo a usar para la predicción.

    Retorna:
    - **predicted_class**: Clase predicha.
    - **probabilities**: Probabilidades para cada clase.

    En caso de error retorna HTTP 400 o 500 con detalle.
    """
    try:
        if model_name not in loaded_models:
            raise HTTPException(status_code=400, detail="Modelo no cargado correctamente")

        model = loaded_models[model_name]
        img_array = await preprocess_image(file)
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction, axis=1)
        probabilities = prediction[0]

        return JSONResponse(content={
            "predicted_class": int(predicted_class[0]),
            "probabilities": probabilities.tolist()
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error en la predicción: {e}"})


# --- Ruta raíz ---
@app.get("/")
async def read_root():
    return {"El backend AI_MODELS_BACKEND está operativo!"}
