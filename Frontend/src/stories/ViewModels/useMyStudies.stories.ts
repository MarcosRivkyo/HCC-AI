import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useMisEstudios",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useMisEstudios\` para la gestión avanzada de estudios médicos en la plataforma HCC-AI.

Funcionalidades principales:
- Gestión del usuario autenticado y sus datos asociados.
- Manejo de listas de estudios (propios, compartidos, todos).
- Filtrado, búsqueda y paginación de estudios.
- Creación, eliminación y actualización de estudios.
- Control de estados para modales de perfil, configuración y asistente.
- Gestión de temas, idioma, escala de interfaz y modo alto contraste.
- Almacenamiento de preferencias en localStorage.
- Manejo de lista de pacientes para asignación y referencia.

Este ViewModel centraliza la lógica para la vista “Mis Estudios” facilitando una gestión eficiente y reactiva.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
