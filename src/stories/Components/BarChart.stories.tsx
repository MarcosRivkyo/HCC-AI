import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import BarChart from "../../views/Components/BarChart";

/**
 * Componente: BarChart
 *
 * Descripción:
 * El componente `BarChart` representa un gráfico de barras utilizado para visualizar probabilidades o distribuciones de clases, 
 * típicamente generadas por un modelo de inteligencia artificial. Admite visualización adaptable a temas claros u oscuros.
 *
 * Dependencias:
 * - `react-chartjs-2`: wrapper de React para Chart.js.
 * - `chart.js`: librería base para renderizar gráficos.
 *
 * Funcionalidad:
 * - Renderiza barras a partir de un conjunto de probabilidades y etiquetas.
 * - Ajusta colores y estilos dinámicamente según el tema activo (`light` o `dark`).
 * - Utiliza props controladas para facilitar pruebas y personalización en Storybook.
 */

const meta: Meta<typeof BarChart> = {
  title: "Components/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "radio",
      options: ["light", "dark"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**BarChart** es un componente de visualización gráfica que utiliza \`react-chartjs-2\` para representar visualmente un conjunto de probabilidades en un gráfico de barras.

Este componente es especialmente útil para mostrar salidas de clasificación de modelos de IA y admite personalización según el tema visual (claro u oscuro).

### Props:
- \`probabilities: number[]\` — Array con las probabilidades que se desean representar.
- \`labels: string[]\` — Etiquetas para cada barra del gráfico.
- \`theme: "light" | "dark"\` — Determina el esquema de colores según el tema activo.

### Dependencias:
- \`chart.js\`
- \`react-chartjs-2\`

### Funcionalidad:
- Visualización clara de distribuciones probabilísticas.
- Adaptación automática de estilo según tema.
- Altamente reutilizable en vistas y paneles de resultados.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    probabilities: [0.12, 0.45, 0.76, 0.22],
    labels: ["Clase A", "Clase B", "Clase C", "Clase D"],
    theme: "light",
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo por defecto del gráfico de barras en modo claro. Muestra la distribución de probabilidades entre cuatro clases.",
      },
    },
  },
};

export const DarkTheme: Story = {
  name: "Vista por defecto",
  args: {
    probabilities: [0.9, 0.1, 0.3],
    labels: ["Positivo", "Negativo", "Incierto"],
    theme: "dark",
  },
  parameters: {
    docs: {
      description: {
        story: "Gráfico de barras adaptado al tema oscuro. Ideal para interfaces con diseño nocturno o de bajo contraste.",
      },
    },
  },
};
