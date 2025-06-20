import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useLoginViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useLoginViewModel\` para la gestión completa del proceso de autenticación en HCC-AI.

Incluye:
- Control de estado para email, contraseña y reestablecimiento.
- Manejo de errores y mensajes de éxito.
- Funciones para iniciar sesión y enviar correo de recuperación.
- Navegación condicional tras autenticación exitosa.
- Control de visibilidad de contraseña y transición de estado.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
