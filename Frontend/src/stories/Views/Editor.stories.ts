// src/stories/PredictImage.stories.tsx

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import PredictImage from "../../views/Pages/Editor";

/**
 * Vista: PredictImage
 *
 * Descripción:
 * `PredictImage` es una vista integral dedicada al procesamiento, edición y análisis de imágenes ecográficas dentro de la plataforma HCC-AI.
 * Está orientada a usuarios clínicos que requieren cargar imágenes médicas, realizar anonimización, aplicar herramientas gráficas
 * y enviar las imágenes a modelos de inteligencia artificial para su evaluación.
 *
 * Dependencias:
 * - `fabric.js`: motor de gráficos vectoriales utilizado para manipular el lienzo.
 * - `Firebase Auth`: gestión de sesión del usuario autenticado.
 * - `REST APIs`: invocación a modelos de IA para predicción o segmentación.
 * - Componentes secundarios: `Toolbox`, `EditorCanvas`, `Assistant`, `SettingsModal`, `ProfileModal`.
 *
 * Funcionalidad:
 * - Subida de imágenes ecográficas desde el sistema local.
 * - Edición sobre lienzo: recorte, anotaciones, herramientas de medición, etc.
 * - Envío de imagen procesada a modelos de IA disponibles para clasificación o segmentación.
 * - Recepción de resultados con overlay visual y métricas asociadas.
 * - Soporte de accesibilidad, escalado, contraste y tema dinámico.
 *
 * Consideraciones técnicas:
 * - Esta vista requiere un entorno completo para funcionar correctamente, incluyendo:
 *   - Contexto de autenticación (Firebase)
 *   - Datos de usuario
 *   - Conexión a endpoints backend
 * - Su uso en Storybook se recomienda únicamente para fines visuales y de estructura (no funcionales).
 */

const meta: Meta<typeof PredictImage> = {
  title: "Views/PredictImage",
  component: PredictImage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
La vista **PredictImage** proporciona un entorno gráfico completo para la edición de imágenes ecográficas y su envío a modelos de predicción por IA.
Esta herramienta integra capacidades de visualización avanzada, edición vectorial, y procesamiento automático con herramientas clínicas de diagnóstico asistido.

### Funcionalidades principales:
- Subida de imágenes en formato estándar JPG o PNG (arrastrando o subiendo).
- Lienzo interactivo basado en \`fabric.js\` con herramientas de anotación.
- Anonimizar imágenes hepáticas con información sensible.
- Crear anotaciones sobre la imagen.
- Herramientas adicionales: recorte, zoom, medida, etiquetas.
- Integración completa con Assistant, Toolbox, SettingsModal y ProfileModal.

        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PredictImage>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Vista del editor de imágenes médicas con funcionalidad de predicción por IA. Solo útil en Storybook como vista estructural sin conexión real a servicios.",
      },
    },
  },
};
