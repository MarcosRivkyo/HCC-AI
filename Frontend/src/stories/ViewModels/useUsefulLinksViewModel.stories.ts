import type { Meta } from "@storybook/react";
import React from "react";

const Placeholder: React.FC = () => null;

const meta: Meta = {
  title: "ViewModels/useUsefulLinksViewModel",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useUsefulLinksViewModel\` para gestionar enlaces útiles personalizados del usuario en HCC-AI.

Funcionalidades principales:
- Carga y sincronización de enlaces con Firestore.
- Añadir y eliminar enlaces con nombre, URL e ícono.
- Carga y conversión de iconos en base64 para previsualización.
- Referencia para input file oculto.

Este ViewModel facilita la gestión reactiva y persistente de enlaces útiles para cada usuario.
        `,
      },
    },
  },
};

export default meta;

export const Default = {};
