import type { Meta, StoryObj } from "@storybook/react";
import MobileWarning from "../../views/Components/MobileWarning";

/**
 * Componente: MobileWarning
 *
 * Descripción:
 * `MobileWarning` es un componente destinado a informar al usuario cuando accede a la plataforma desde un dispositivo móvil.
 * Se utiliza en contextos donde la experiencia de usuario está optimizada para escritorio y se requiere advertir sobre posibles
 * limitaciones funcionales en pantallas reducidas.
 *
 * Dependencias:
 * - `react-i18next`: para soporte multilingüe del mensaje mostrado.
 * - `Tailwind CSS`: para el diseño visual de la alerta.
 *
 * Funcionalidad:
 * - Detecta automáticamente el agente de usuario (`userAgent`) para determinar si se trata de un dispositivo móvil.
 * - Si se confirma, muestra un mensaje de advertencia destacado mediante estilos visuales adaptativos.
 * - El contenido del mensaje se traduce dinámicamente según el idioma activo en la aplicación.
 * - Este componente no requiere propiedades externas ni maneja estado interno complejo.
 */

const meta: Meta<typeof MobileWarning> = {
  title: "Components/MobileWarning",
  component: MobileWarning,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **MobileWarning** proporciona una advertencia visual cuando el sistema detecta que el usuario accede desde un dispositivo móvil. 
Está pensado para informar sobre posibles limitaciones o incompatibilidades en resoluciones pequeñas, en especial cuando la aplicación 
está optimizada para uso en pantallas de escritorio.

### Características técnicas:
- Detección automática del tipo de dispositivo a través del agente de usuario.
- Diseño visual con utilidades de \`Tailwind CSS\`.
- Traducción de mensajes mediante el hook \`useTranslation\` de \`react-i18next\`.
- No requiere configuración adicional ni props externas.

Este componente puede ser útil en vistas críticas que no garantizan una experiencia completa en dispositivos móviles.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MobileWarning>;

export const Default: Story = {
  name: "Vista por defecto",  
  parameters: {
    docs: {
      description: {
        story: "Ejemplo por defecto del componente de advertencia para dispositivos móviles. Visible únicamente si se simula un agente móvil.",
      },
    },
  },
};
