import ollama

respuesta = ollama.chat(
    model='llama3.2-vision',
    messages=[
        {'role': 'user', 'content': '¿Qué hay en esta imagen?', 'images': ['C:\\Users\\marco\\Downloads\\liver_ultrasound.v11i.voc\\test\\4_png.rf.615e8a738b6d13566c70be4826da4e0b.jpg']}
    ]
)

print(respuesta['message']['content'])
