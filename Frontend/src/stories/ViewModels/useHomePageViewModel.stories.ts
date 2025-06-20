import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useHomePageViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useHomePageViewModel\` que gestiona el estado y lógica para la página principal (dashboard) de HCC-AI.

Funcionalidades principales:
- Gestión del usuario autenticado y sus datos asociados.
- Control de modales de perfil, configuración y asistente.
- Manejo de temas (claro/oscuro), idioma, escala de interfaz y alto contraste.
- Gestión de datos para formularios de estudios médicos.
- Persistencia de preferencias en localStorage.
- Selección de imágenes para vista previa o edición.

Este ViewModel centraliza la lógica para una experiencia personalizada y accesible en la página principal de la plataforma.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
