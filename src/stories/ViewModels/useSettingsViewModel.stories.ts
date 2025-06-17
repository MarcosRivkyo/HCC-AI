import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useSettingsViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useSettingsViewModel\` para la gestión de la configuración y administración de usuarios en HCC-AI.

Funcionalidades principales:
- Gestión de secciones activas y expansión de items UI.
- Control de tema claro/oscuro y preferencias visuales.
- Manejo de datos de usuario: nombre, teléfono, imagen de perfil.
- Actualización de datos y perfil de usuario con DAO.
- Control y actualización del estado global del sistema.
- Filtrado y búsqueda de usuarios por rol y nombre.
- Gestión de recordatorios diarios.
- Eliminación lógica de usuarios.
- Integración con Firestore y DAO para persistencia y consultas.

Este ViewModel centraliza la lógica para la configuración avanzada y administración dentro de la plataforma.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
