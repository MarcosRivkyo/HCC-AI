import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useLogoutViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useLogoutViewModel\` que maneja la lógica para cerrar sesión en la plataforma HCC-AI.

Funcionalidades:
- Invoca el cierre de sesión usando AuthDAO.
- Redirige al usuario a la página de login tras cerrar sesión.
- Manejo básico de errores.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
