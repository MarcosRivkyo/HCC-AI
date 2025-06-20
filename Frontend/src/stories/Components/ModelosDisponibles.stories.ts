import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ModelosDisponibles from "../../views/Components/AvailableModels";

/**
 * Componente: ModelosDisponibles
 *
 * Descripción:
 * `ModelosDisponibles` es un componente encargado de mostrar al usuario una lista de modelos de inteligencia artificial disponibles 
 * en la plataforma, junto con información detallada sobre cada uno. Se utiliza como parte de la interfaz de gestión y selección 
 * de modelos entrenados para tareas clínicas específicas.
 *
 * Dependencias:
 * - `react-i18next`: permite la traducción dinámica de textos de la interfaz.
 * - `useModelsViewModel`: encapsula la lógica de negocio relacionada con la obtención, filtrado y ordenación de modelos.
 * - `tailwindcss`: aplicado para estilos visuales y disposición responsiva del contenido.
 *
 * Funcionalidad:
 * - Lista modelos disponibles con nombre, tipo, descripción y fecha de entrenamiento.
 * - Permite filtrar por nombre y tipo mediante un formulario de búsqueda.
 * - Incluye control de paginación y navegación entre páginas.
 * - Ordenamiento visual por diferentes campos relevantes.
 * - Adaptado para dispositivos móviles y accesibilidad general.
 */

const meta: Meta<typeof ModelosDisponibles> = {
  title: "Components/ModelosDisponibles",
  component: ModelosDisponibles,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **ModelosDisponibles** permite visualizar y explorar los modelos de inteligencia artificial entrenados e integrados 
en la plataforma HCC-AI. Se presenta como una tabla con capacidad de filtrado y paginación.

### Características técnicas:
- Visualización de metadatos: nombre, descripción, tipo de modelo, fecha de entrenamiento.
- Filtros por nombre y tipo, útiles para búsquedas específicas.
- Navegación por páginas de resultados mediante sistema de paginación.
- Traducción de campos y etiquetas mediante \`react-i18next\`.
- Gestión del estado y lógica de datos delegada al ViewModel \`useModelsViewModel\`.
- Estilos definidos con clases utilitarias de \`tailwindcss\`, con soporte responsivo.

Este componente está diseñado para facilitar la selección e inspección de modelos disponibles, tanto por profesionales clínicos como por personal técnico.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ModelosDisponibles>;

export const Default: Story = {
  name: "Vista por defecto",  
  parameters: {
    docs: {
      description: {
        story: "Visualización por defecto del componente con listado paginado de modelos disponibles y filtros aplicables.",
      },
    },
  },
};
