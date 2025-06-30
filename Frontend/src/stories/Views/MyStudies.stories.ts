// src/stories/MisEstudios.stories.tsx

import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MisEstudios from "../../views/Pages/MyStudies";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * @file MisEstudios.stories.tsx
 * @description Historia de Storybook para la vista de estudios clínicos asociados al usuario.
 * Simula el entorno de navegación para permitir el renderizado completo de rutas internas.
 */

const meta: Meta<typeof MisEstudios> = {
  title: "Views/MisEstudios",
  component: MisEstudios,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Vista: MisEstudios

La vista **MisEstudios** permite al usuario autenticado visualizar y gestionar los estudios clínicos que tiene asignados dentro de la plataforma **HCC-AI**.

---

## Funcionalidades principales

- Visualización de lista paginada de estudios por usuario.
- Acceso al detalle de cada estudio mediante navegación interna.
- Uso del hook \`useNavigate\` para transiciones de ruta.
- Integración con filtros, búsqueda y acciones contextuales.
- Soporte para traducción internacional mediante \`react-i18next\`.

---

## Dependencias clave

- \`react-router-dom\`: gestión de navegación interna y rutas dinámicas.
- \`useStudiesViewModel\`: lógica desacoplada para consulta y filtrado.
- \`tailwindcss\`: diseño adaptativo y responsivo.
- \`react-toastify\`: notificaciones emergentes para acciones del usuario.

---

## Consideraciones técnicas

- Requiere un entorno autenticado y acceso a Firestore o backend.
- Idealmente envuelto en \`<MemoryRouter>\` cuando se testea de forma aislada.
- Integra otros componentes de layout como \`Navbar\`, \`Footer\`, y modales si están activos.

        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MisEstudios>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Render completo de la vista de estudios asignados al usuario con navegación simulada.",
      },
    },
  },
};
