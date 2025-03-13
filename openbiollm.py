import torch
import transformers

model_id = "aaditya/OpenBioLLM-Llama3-8B"

# Verifica si hay una GPU disponible
device = "cuda" if torch.cuda.is_available() else "cpu"

pipeline = transformers.pipeline(
    "text-generation",
    model=model_id,
    model_kwargs={"torch_dtype": torch.bfloat16},  # Usa bfloat16 para menor consumo de VRAM
    device=0 if device == "cuda" else -1,  # Usa la GPU si está disponible
)

# Mensajes de prueba
messages = [
    {"role": "system", "content": "You are an expert in healthcare and biomedical sciences."},
    {"role": "user", "content": "What are the symptoms of liver cancer?"}
]

# Convierte los mensajes en un prompt
input_text = "\n".join([f"{m['role']}: {m['content']}" for m in messages])

# Generar la respuesta
outputs = pipeline(
    input_text,
    max_new_tokens=256,
    do_sample=True,  # Asegúrate de que este sea True
    temperature=0.7,  # Aumenta la temperatura si es necesario
    top_p=0.9,
    top_k=50,  # Añade un valor de top_k para limitar las opciones generadas
)

# Imprime el contenido completo de los outputs
print(outputs)

# Muestra la respuesta generada
if len(outputs) > 0:
    print(outputs[0]["generated_text"][len(input_text):])
else:
    print("No se generó respuesta.")
