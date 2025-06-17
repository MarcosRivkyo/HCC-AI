// src/stories/DetailedStudy.stories.tsx

import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EstudioDetalle from "../../views/Pages/DetailedStudy";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Vista: EstudioDetalle
 *
 * Descripción:
 * `EstudioDetalle` es una vista dedicada a mostrar la información completa y detallada de un estudio clínico específico.
 * Está orientada a usuarios médicos o administrativos que requieren revisar los datos, resultados y recursos asociados a una exploración previa 
 * almacenada en la plataforma HCC-AI.
 *
 * Dependencias:
 * - `react-router-dom`: para obtención de parámetros dinámicos desde la URL (`studyId`).
 * - `Firebase Firestore`: para cargar los datos del estudio y sus resultados.
 * - `react-i18next`: para internacionalización de textos.
 * - Componentes secundarios: `NavbarSecond`, `Footer`, `Assistant`, `ProfileModal`, `SettingsModal`.
 *
 * Funcionalidad:
 * - Visualización de los metadatos del estudio (nombre, fecha, autor, estado).
 * - Acceso a resultados generados por los modelos de IA (por ejemplo, predicción, segmentación).
 * - Descarga de informes en PDF u otros formatos.
 * - Navegación contextual a partir del identificador de estudio.
 *
 * Consideraciones técnicas:
 * - Esta vista requiere estar correctamente enrutada con un parámetro dinámico (`/estudio/:id`) para funcionar correctamente.
 * - Su integración requiere autenticación previa y conexión con servicios en tiempo real para obtener datos actualizados.
 */

const meta: Meta<typeof EstudioDetalle> = {
  title: "Views/EstudioDetalle",
  component: EstudioDetalle,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
La vista **EstudioDetalle** permite acceder a la información completa de un estudio clínico individual, incluyendo 
los datos ingresados por el usuario, los resultados procesados por los modelos de IA, y los recursos descargables relacionados.

### Características técnicas:
- Obtiene el identificador del estudio desde la URL mediante \`react-router-dom\`.
- Carga la información detallada desde Firebase Firestore.
- Presenta resultados visuales y métricas de análisis.
- Permite descargar informes clínicos generados.
- Integra componentes auxiliares como \`Assistant\`, \`ProfileModal\` y \`SettingsModal\`.

> Esta vista requiere un entorno funcional con autenticación activa y base de datos conectada para mostrar datos reales.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EstudioDetalle>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Vista base del detalle de estudio clínico. Requiere simular el enrutamiento con parámetro de ID para funcionar completamente.",
      },
    },
  },
};
