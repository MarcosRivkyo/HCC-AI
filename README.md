# USAL-HCC-AI



## Resumen del Proyecto

El proyecto titulado "HCC-AI" tiene como objetivo desarrollar un modelo de aprendizaje automático robusto y preciso para la detección y delimitación automática de hepatocarcinomas a partir de imágenes de ecografía hepática. El HCC es un tipo de cáncer de hígado que representa entre el 80-90% de los tumores hepáticos malignos y es la tercera causa de muerte por cáncer a nivel mundial. Dado que la mayoría de los hepatocarcinomas aparecen en pacientes con cirrosis hepática, el diagnóstico precoz es crucial para un tratamiento curativo.

El proyecto utiliza tecnologías y técnicas de vanguardia, incluyendo Redes Neuronales Convolucionales (CNNs), para procesar y analizar imágenes médicas. Los modelos de CNN se entrenan con un conjunto de datos diverso y extenso de imágenes de ecografía hepática, asegurando una alta precisión en la detección y delimitación de tumores, así como en la identificación de su grado y evolución.

## Antecedentes

Las imágenes médicas desempeñan un papel crucial en el diagnóstico y tratamiento de enfermedades, como el carcinoma hepatocelular. La ecografía hepática es una técnica ampliamente utilizada para evaluar el hígado y detectar anomalías. Sin embargo, la interpretación manual de estas imágenes por parte de los radiólogos es un proceso que consume tiempo y puede ser subjetivo. Existe una necesidad creciente de sistemas automatizados que puedan asistir en el diagnóstico rápido y preciso de condiciones médicas, especialmente en el caso del CHC.

Para abordar esta necesidad, el proyecto aprovecha el poder del aprendizaje automático, en particular las Redes Neuronales Convolucionales (CNNs), para automatizar el análisis de imágenes médicas. Las CNNs son altamente efectivas en tareas de reconocimiento de imágenes debido a su capacidad para aprender representaciones jerárquicas de características.

## Planteamiento del Problema

Desarrollar un modelo basado en Redes Neuronales Convolucionales (CNNs) preciso y confiable para la detección y delimitación de hepatocarcinomas en imágenes de ecografía hepática. El proyecto busca agilizar el proceso de análisis de imágenes médicas, reducir la carga de trabajo de los médicos y mejorar la atención al paciente, abordando al mismo tiempo consideraciones éticas y de privacidad.

## Importancia

**1. Mejora de la Precisión del Diagnóstico:** Identifica patrones sutiles en las imágenes médicas que podrían pasar desapercibidos para el ojo humano.

**2. Eficiencia y Velocidad:** Acelera el flujo de trabajo diagnóstico, permitiendo a los profesionales de la salud tomar decisiones más rápidas.

**3. Reducción de la Carga de Trabajo:** Asiste a los radiólogos al manejar casos rutinarios, permitiéndoles centrarse en diagnósticos más complejos.

**4. Accesibilidad:** Hace que las herramientas de diagnóstico avanzado estén disponibles para una gama más amplia de instalaciones médicas, incluyendo aquellas en áreas remotas o desatendidas.

**5. Aprendizaje Continuo y Mejora:** El modelo puede mejorar continuamente con más datos, manteniéndose actualizado con los avances médicos.

**6. Cumplimiento Ético y Normativo:** Garantiza la privacidad de los datos del paciente y aborda posibles sesgos en el modelo para proporcionar diagnósticos justos y precisos.


# Objetivos del Proyecto

**Recopilación de Datos:** Obtener un conjunto de datos diverso de imágenes de ecografía hepática para la detección y delimitación de hepatocarcinomas.

**Preprocesamiento de Datos:** Limpiar, normalizar y preprocesar las imágenes para garantizar consistencia y prepararlas para el entrenamiento del modelo.

**Entrenamiento del Modelo:** Implementar y entrenar modelos de Redes Neuronales Convolucionales (CNNs) utilizando PyTorch para la clasificación y segmentación de imágenes médicas.

**Optimización de Hiperparámetros:** Ajustar los hiperparámetros de los modelos de CNN para mejorar su rendimiento y precisión.

**Evaluación y Validación:** Probar y validar rigurosamente el rendimiento de los modelos para garantizar su confiabilidad y generalización.

**Desarrollo de la Interfaz de Usuario:** Crear una interfaz intuitiva para que los profesionales médicos carguen y analicen imágenes médicas utilizando los modelos entrenados.

**Despliegue:** Implementar los modelos en una plataforma web utilizando tecnologías como React o Angular, haciéndolos accesibles para el diagnóstico en tiempo real.

**Consideraciones Éticas:** Abordar preocupaciones éticas, como la privacidad de los datos del paciente y los sesgos del modelo, para garantizar un uso responsable de la tecnología.

## Requisitos Técnicos

Backend: Python con Django o Flask


Frontend: React, Angular o Vue.js


Base de datos: PostgreSQL, MySQL o Firebase


Control de versiones: GitLab


Metodología: Ágil



**Lenguaje de Programación:** Python 3.6 o superior.

**Bibliotecas y Frameworks:**

1. TensorFlow: Para el desarrollo de modelos de aprendizaje profundo.

2. OpenCV: Para el procesamiento de imágenes.

3. React/Angular: Para el desarrollo de la interfaz de usuario.

4. FastAPI: Para la creación de la API del servidor.

5. Uvicorn: Para ejecutar el servidor ASGI.

**Hardware:**

GPU (opcional pero recomendado) para acelerar el entrenamiento y la inferencia del modelo.

**Datos:**

Imágenes de ecografía hepática etiquetadas para entrenar y validar los modelos, proporcionadas por el Hospital.

## Flujo del Proyecto

**1. Recopilación de Datos (Data Collection)**

**2. Preprocesamiento de Datos (Data Preprocessing)**

**3. Selección de la Arquitectura del Modelo (Model Architecture Selection)**

**4. Entrenamiento del Modelo (Model Training)**

**5. Ajuste de Hiperparámetros (Hyperparameter Tuning)**

**6. Evaluación del Modelo (Model Evaluation)**

**7. Pruebas y Validación (Testing and Validation)**

**8. Desarrollo de la Interfaz de Usuario (User Interface Development)**

**9. Despliegue (Deployment)**

**10. Consideraciones Éticas (Ethical Considerations)**

**11. Monitoreo y Mantenimiento (Monitoring and Maintenance)**

**12. Documentación y Reportes (Documentation and Reporting)**


## Instalación y Uso
**Sigue estos pasos para configurar y usar la aplicación:**

1.Clona el repositorio.

2. Instala las dependencias necesarias.
