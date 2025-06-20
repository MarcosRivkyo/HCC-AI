import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useModelsViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useModelsViewModel\` para la gestión y visualización de modelos de IA en la plataforma HCC-AI.

Incluye:
- Carga de usuario y sus datos.
- Listado y gestión de modelos IA.
- Control de modales (perfil, configuración, asistente).
- Manejo de estado para temas, idioma, escala y accesibilidad.
- Estado para interacción visual (hover) en modelos.
- Navegación interna mediante \`navigate\`.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
