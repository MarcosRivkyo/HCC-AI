import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useFilesViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useFilesViewModel\` para la gestión integral de archivos clínicos dentro de HCC-AI.

Incluye:
- Autenticación y datos de usuario.
- Agrupación, paginación y navegación por carpetas.
- Subida, eliminación y edición de archivos.
- Visualización de información detallada en modales.
- Control de temas y accesibilidad.
- Integración con rutas para edición y navegación.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
