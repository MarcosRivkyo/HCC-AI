import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Footer from "../../views/Components/AppFooter";

/**
 * Componente: Footer
 *
 * Descripción:
 * `Footer` es el componente que representa el pie de página de la aplicación HCC-AI. 
 * Está diseñado para ofrecer información institucional, enlaces a entidades colaboradoras y datos de contacto personal/profesional.
 *
 * Dependencias:
 * - `react-i18next`: para soporte multilingüe.
 * - `react-icons`: para iconografía de redes sociales.
 * - Imágenes locales: `logoHCC_AI.jpg`, `logo_usal.png`, `logoHP.png`.
 *
 * Funcionalidad:
 * - Muestra el logotipo de la plataforma junto con enlaces a organizaciones asociadas.
 * - Incluye datos de contacto del autor: correo electrónico, perfil de LinkedIn y repositorio GitHub.
 * - Integra traducciones dinámicas mediante el hook `useTranslation("global")`.
 * - Es completamente responsivo y se adapta a diferentes tamaños de pantalla.
 * - No requiere props ni maneja estado local. Se puede integrar directamente en cualquier layout general.
 */

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
El componente **Footer** representa el pie de página estándar de la aplicación web **HCC-AI**. 
Incluye elementos de identidad institucional, datos de contacto del autor y enlaces a entidades colaboradoras del proyecto.

### Características técnicas:
- Integra logotipos institucionales: Universidad de Salamanca (USAL), HP SCDS y HCC-AI.
- Presenta enlaces de contacto personal: correo, LinkedIn y GitHub.
- Utiliza el hook \`useTranslation("global")\` para soporte multilingüe mediante \`react-i18next\`.
- Basado en utilidades de \`Tailwind CSS\` para garantizar un diseño adaptativo y consistente.
- Emplea iconos de \`react-icons\`, como \`FaEnvelope\`, \`FaLinkedin\` y \`FaGithub\`.

### Consideraciones:
- Este componente no requiere propiedades externas (\`props\`) ni mantiene estado interno.
- Es adecuado para su inclusión en cualquier vista o layout principal del sistema.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  name: "Vista por defecto",  
  parameters: {
    docs: {
      description: {
        story: "Renderizado por defecto del pie de página institucional con enlaces de contacto y contenido traducido.",
      },
    },
  },
};
