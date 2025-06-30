import type { Meta, StoryObj } from "@storybook/react";
import ImageCarrousel from "../../views/Components/ImageCarrousel";

/**
 * Componente: ImageCarrousel
 *
 * Descripción:
 * `ImageCarrousel` es un componente que permite visualizar múltiples imágenes de forma secuencial y automática,
 * mediante un carrusel interactivo. Está diseñado para facilitar la exploración de conjuntos de imágenes médicas
 * o ilustraciones relevantes dentro de la interfaz de usuario.
 *
 * Dependencias:
 * - `react-slick`: biblioteca de carruseles basada en `slick-carousel`.
 * - `slick-carousel`: estilos y animaciones del componente base.
 *
 * Funcionalidad:
 * - Permite recorrer imágenes mediante navegación manual o automática.
 * - Emite un callback `onImageSelect` cuando se selecciona una imagen específica.
 * - Admite personalización de estilos mediante clases externas.
 * - Las imágenes deben ser pasadas como hijos o props desde el contenedor padre.
 */

const meta: Meta<typeof ImageCarrousel> = {
  title: "Components/ImageCarrousel",
  component: ImageCarrousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **ImageCarrousel** ofrece una interfaz de navegación para visualizar un conjunto de imágenes 
de forma deslizante. Está basado en la librería \`react-slick\` y permite tanto navegación automática como interacción manual.

### Características técnicas:
- Utiliza la biblioteca \`react-slick\` como motor del carrusel.
- Incluye compatibilidad con el evento \`onImageSelect(url)\`, que permite reaccionar a la selección de imágenes.
- Pensado para mostrar imágenes relacionadas con estudios clínicos, resultados visuales u otros elementos gráficos relevantes.
- Puede integrarse fácilmente en paneles informativos o secciones de resultados visuales.

Este componente no incorpora lógica de negocio, y se comporta como un elemento de presentación pura.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageCarrousel>;

export const Default: Story = {
  name: "Vista por defecto",
  args: {
    onImageSelect: (url: string) => console.log("Imagen seleccionada:", url),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo por defecto del carrusel con tres imágenes, incluyendo el logotipo del proyecto. No requiere mocks ni configuración adicional.",
      },
    },
  },
};
