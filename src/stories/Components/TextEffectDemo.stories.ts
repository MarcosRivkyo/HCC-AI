import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TextEffectDemo } from "../../views/Components/TextEffectDemo";

/**
 * Componente: TextEffectDemo
 *
 * Descripción:
 * `TextEffectDemo` es un componente de demostración que renderiza un título animado palabra por palabra, 
 * utilizando efectos visuales progresivos de entrada basados en opacidad y desenfoque. Está pensado para su uso en portadas, 
 * secciones introductorias o encabezados destacados de la plataforma.
 *
 * Dependencias:
 * - `framer-motion`: para animación declarativa de elementos.
 * - `tailwindcss`: para diseño visual adaptativo y compatibilidad con modo oscuro.
 * - `TextGenerateEffect`: subcomponente encargado de aplicar la lógica de animación a cada palabra.
 * - `lib/utils.ts` (`cn()`): función para composición condicional de clases CSS.
 *
 * Funcionalidad:
 * - Recibe un idioma como prop (`lang`) para determinar el contenido textual mostrado.
 * - Genera una animación por palabra con posibilidad de efecto de desenfoque inicial.
 * - Permite personalización de duración, estilo y filtros desde el subcomponente.
 * - Compatible con temas claro/oscuro y diseño responsivo.
 */

const meta: Meta<typeof TextEffectDemo> = {
  title: "Components/TextEffectDemo",
  component: TextEffectDemo,
  tags: ['autodocs'],
  args: {
    lang: "es",
  },
  parameters: {
    docs: {
      description: {
        component: `
El componente **TextEffectDemo** permite representar un mensaje animado mediante una secuencia de aparición progresiva de palabras, 
utilizando animaciones individuales definidas con \`framer-motion\`. Está diseñado para destacar textos clave dentro de la interfaz.

### Props principales:

| Prop     | Tipo              | Descripción                                                   |
|----------|-------------------|---------------------------------------------------------------|
| \`lang\`   | \`"es" | "eng"\`     | Idioma del texto a mostrar. Afecta al contenido renderizado. |

### Subcomponente: TextGenerateEffect

| Prop        | Tipo         | Descripción                                                              |
|-------------|--------------|--------------------------------------------------------------------------|
| \`words\`     | \`string\`    | Texto completo a animar. Se fragmenta automáticamente en palabras.     |
| \`duration\`  | \`number\`    | Duración total de la animación (en segundos).                          |
| \`filter\`    | \`boolean\`   | Aplica un desenfoque inicial a cada palabra (efecto de aparición).     |
| \`className\` | \`string?\`   | Clases CSS adicionales para estilos personalizados.                    |

### Tecnologías empleadas:
- \`framer-motion\`: para animaciones con control granular.
- \`tailwindcss\`: para clases responsivas y compatibilidad visual.
- \`utils/cn\`: para combinación condicional de clases.

Este componente es útil para crear transiciones visuales atractivas en la interfaz de usuario, especialmente en contextos de presentación o introducción.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextEffectDemo>;

export const Spanish: Story = {
  args: {
    lang: "es",
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo del componente mostrando un título animado en español, utilizado como introducción en la plataforma HCC-AI.",
      },
    },
  },
};

export const English: Story = {
  name: "Vista por defecto",  
  args: {
    lang: "eng",
  },
  parameters: {
    docs: {
      description: {
        story: "Versión en inglés del componente, con animación secuencial de palabras para la presentación del sistema HCC-AI.",
      },
    },
  },
};
