import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useSignupViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useSignupViewModel\` para gestionar el registro de usuarios en la plataforma HCC-AI.

Funcionalidades principales:
- Validación de datos de registro (usuario, contraseña, código de acceso).
- Registro mediante Firebase Authentication.
- Actualización del perfil del usuario con foto por defecto.
- Envío de correo de verificación.
- Creación de perfil usuario en Firestore con datos iniciales y enlaces útiles.
- Gestión de estados y mensajes de error/éxito.

Este ViewModel asegura un proceso robusto y seguro para el alta de nuevos usuarios en el sistema.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
