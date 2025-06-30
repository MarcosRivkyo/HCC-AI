import type { Meta, StoryObj } from "@storybook/react";
import ImageSlider from "../../views/Components/ImageSlider";

/**
 * Componente: ImageSlider
 *
 * Descripción:
 * `ImageSlider` es un componente visual que permite mostrar una secuencia de imágenes con transiciones automáticas
 * mediante efecto de desvanecimiento (fade in/out). Está orientado a presentar contenido gráfico de manera continua y fluida,
 * como imágenes representativas de estudios, resultados o campañas informativas.
 *
 * Dependencias:
 * - `React`: para el control del ciclo de vida del componente.
 * - `Tailwind CSS`: para la animación suave y estilos utilitarios.
 *
 * Funcionalidad:
 * - Cambia de imagen automáticamente cada 6 segundos.
 * - Utiliza imágenes locales estáticas definidas en el propio componente.
 * - Emplea clases utilitarias para controlar opacidad y transición entre imágenes.
 * - No requiere configuración externa ni props específicas.
 */

const meta: Meta<typeof ImageSlider> = {
  title: "Components/ImageSlider",
  component: ImageSlider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **ImageSlider** proporciona una visualización cíclica de imágenes con efecto de desvanecimiento entre transiciones. 
Está especialmente indicado para secciones introductorias o informativas de la plataforma donde se desea destacar contenido gráfico relevante.

### Características técnicas:
- Transición suave entre imágenes mediante clases de \`Tailwind CSS\`.
- Cambio automático cada 6 segundos.
- Basado en imágenes locales incluidas en el componente.
- No recibe propiedades externas (\`props\`); se comporta como un componente autónomo.

Este componente tiene una finalidad exclusivamente visual y se utiliza típicamente en portadas o encabezados de página.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageSlider>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo por defecto del carrusel de imágenes con animación de desvanecimiento automático cada seis segundos.",
      },
    },
  },
};
