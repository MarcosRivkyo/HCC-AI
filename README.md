
# HCC-AI

<div align="center">

<img src="Frontend/src/assets/images/logo_hcc_ai.jpg" alt="Logo del sistema HCC-AI" width="400"/>

<p><strong>Figura 1.</strong> Logo del sistema HCC-AI</p>

</div>

## Autor: 
Marcos Rivas Kyoguro

## Resumen del Proyecto

**HCC-AI** es un sistema de apoyo al diagnóstico clínico desarrollado como Trabajo Fin de Grado (TFG) en la Universidad de Salamanca. Su objetivo es asistir en la detección y segmentación de hepatocarcinoma (HCC) en imágenes de ecografía hepática utilizando técnicas de inteligencia artificial, específicamente modelos de Deep Learning.

El sistema implementa modelos de IA basadas en CNNs, entrenada y validada sobre un conjunto de datos reales . Se ha puesto especial atención en la interpretación visual de los resultados y en la experiencia de uso para profesionales médicos.

---

## Contexto y Motivación

En las últimas décadas, el uso de la inteligencia artificial, y en particular del aprendizaje automático (Machine Learning), ha transformado múltiples disciplinas, entre ellas el ámbito sanitario. Estas tecnologías permiten automatizar tareas complejas que requieren analizar grandes volúmenes de datos, lo que se traduce en diagnósticos más rápidos, detección precoz de enfermedades y una mayor eficiencia en la toma de decisiones clínicas.

En este contexto, el cáncer de hígado, específicamente el carcinoma hepatocelular (HCC), representa un desafío prioritario. El HCC es la forma más común de tumor hepático maligno, con una elevada tasa de mortalidad, agravada por la dificultad de su detección temprana. La mayoría de los casos se diagnostican en etapas avanzadas, donde las opciones terapéuticas son limitadas y menos efectivas. Por ello, el desarrollo de herramientas de apoyo al diagnóstico que mejoren la sensibilidad y especificidad es crucial para la práctica médica.

Tal como se muestra en la Figura 2, el lazo verde se ha consolidado como el símbolo internacional de la concienciación sobre el cáncer de hígado. Este emblema busca visibilizar la enfermedad, fomentar la prevención y apoyar a los pacientes y familiares que la enfrentan.



<div align="center">

<img src="Frontend/src/assets/images/smbolo_cancer_higado.jpg" alt="Símbolo de la concienciación del cáncer de hígado" width="150"/>

<p><strong>Figura 2.</strong> Símbolo de la concienciación del cáncer de hígado</p>

</div>

El presente Trabajo de Fin de Grado aborda esta problemática desde una perspectiva tecnológica, mediante la aplicación de modelos de inteligencia artificial sobre imágenes médicas, en concreto, imágenes de ecografía hepática. El objetivo principal es desarrollar un sistema capaz de identificar automáticamente la presencia de hepatocarcinomas, evaluar su grado de evolución y delimitar con precisión las áreas afectadas. Este enfoque busca no solo agilizar el proceso diagnóstico, sino también reducir la dependencia de pruebas invasivas como biopsias o de técnicas más costosas como la resonancia magnética o el TAC.

El desarrollo del modelo se ha llevado a cabo utilizando técnicas de redes neuronales convolucionales (CNNs), ampliamente utilizadas en tareas de segmentación y clasificación de imágenes médicas. Además, el proyecto contempla la implementación de una aplicación interactiva que permita a los profesionales médicos y pacientes visualizar los resultados de forma intuitiva, facilitando su interpretación y validación.

La arquitectura propuesta se fundamenta en un entorno híbrido de tecnologías modernas que permiten una integración fluida entre los modelos de inteligencia artificial y la interfaz de usuario clínica. El desarrollo del modelo de IA se ha llevado a cabo en **Python**, utilizando **TensorFlow** para la implementación de redes neuronales, y **OpenCV** para el procesamiento de imágenes médicas. Por su parte, el diseño y despliegue del **frontend** se realiza mediante **React**, lo que garantiza una experiencia interactiva, accesible y eficiente para el profesional sanitario.

### Pipeline del sistema

1. **Clasificación hepática:**  
   Se aplica un modelo de clasificación sobre la imagen ecográfica para predecir el estado general del hígado, incluyendo niveles de fibrosis o indicios de carcinoma hepatocelular.

2. **Segmentación anatómica:**  
   Se activa un modelo de segmentación (**YOLOv8**) que delimita con precisión las principales estructuras hepáticas relevantes, tales como el hígado, lesiones tumorales (HCC), riñón, vena porta (PV), vena hepática, entre otras.

3. **Explicación generativa:**  
   Se utiliza un modelo generativo de lenguaje natural (**Gemini**) que interpreta los resultados anteriores y genera una explicación textual clara y comprensible. Esta descripción facilita al médico la comprensión de los hallazgos, sirviendo como una segunda opinión asistida.

---



### Anexos del Proyecto

- Anexo I – Plan de Proyecto Software  
- Anexo II – Especificación de Requisitos Software  
- Anexo III – Análisis del Sistema Software  
- Anexo IV – Diseño del Sistema Software  
- Anexo V – Documentación del Código Fuente  
- Anexo VI – Manual del Usuario  
- Anexo VII – Desarrollo de la Inteligencia Artificial  

**Acceso a la documentación completa:**  
[https://hcc-ai.vercel.app/documentation](https://hcc-ai.vercel.app/documentation)

---



## Herramientas y Tecnologías

- **Lenguaje:** Python 3.10
- **Modelado:** TensorFlow, OpenCV, YOLOv8
- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** FastAPI + Uvicorn + Google Cloud Run
- **Control de versiones:** GitLab
- **Entrenamiento:** GPU (Colab / CUDA)

---

## Instalación

### No es necesaria la instalación local

Puede acceder directamente a la aplicación web desplegada en:

[https://hcc-ai.vercel.app](https://hcc-ai.vercel.app)

Esto permite utilizar el sistema desde cualquier navegador sin necesidad de configuración previa.
