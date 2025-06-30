// src/stories/Models.stories.tsx

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Models from "../../views/Pages/Models";

/**
 * @file Models.stories.tsx
 * @description Historia de Storybook para la vista de modelos disponibles en HCC-AI.
 * Permite visualizar la organización y diseño de los distintos modelos de clasificación,
 * segmentación y generación disponibles en el sistema.
 */

const meta: Meta<typeof Models> = {
  title: "Views/Models",
  component: Models,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Vista: Models

La vista **Models** presenta una interfaz estructurada para la exploración de modelos de inteligencia artificial disponibles en la plataforma **HCC-AI**.

---

## Funcionalidades principales

- Visualización de modelos categorizados por tipo:
  - Clasificación
  - Segmentación
  - Generación 
- Detalle de nombre, fecha de entrenamiento y tipo de arquitectura.
- Navegación entre modelos mediante interfaz tipo carrusel o lista.
- Uso de traducción dinámica mediante \`react-i18next\`.

---

## Dependencias

- \`react-router-dom\`: navegación dentro de la aplicación.
- \`react-i18next\`: soporte multilingüe.
- \`tailwindcss\`: diseño responsivo.
- \`useModelsViewModel\`: lógica para la gestión y filtrado de modelos.

---

## Observaciones técnicas

- Esta vista se renderiza en pantalla completa.
- Requiere un proveedor de rutas para funcionar correctamente.
- Puede integrarse con componentes como filtros avanzados, paginación, y modales de detalles del modelo.

        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Models>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Renderizado completo de la vista de modelos con navegación por categorías y soporte de traducción.",
      },
    },
  },
};
