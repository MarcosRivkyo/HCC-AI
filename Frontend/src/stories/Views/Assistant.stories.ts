import type { Meta, StoryObj } from "@storybook/react";
import Assistant from "../../views/Pages/AssistantView";
import { MemoryRouter } from "react-router-dom";

/**
 * Vista: Assistant
 *
 * Descripción:
 * La vista `Assistant` implementa una interfaz de conversación tipo chatbot que actúa como asistente virtual dentro de la plataforma HCC-AI.
 * Está integrada con un modelo de lenguaje para ofrecer soporte contextual, guía interactiva y respuestas automáticas a consultas frecuentes de los usuarios.
 *
 * Dependencias:
 * - `react-i18next`: para traducción dinámica de la interfaz.
 * - `useAssistantViewModel`: hook que encapsula toda la lógica de la conversación.
 * - `react-router-dom`: requerido para su integración en el sistema de rutas.
 *
 * Funcionalidad:
 * - Permite la comunicación entre usuario y sistema mediante mensajes consecutivos.
 * - Auto-scroll hacia el último mensaje tras cada envío.
 * - Área de entrada expandible y adaptativa.
 * - Indicador animado de carga mientras se espera respuesta.
 * - Soporte multilingüe.
 *
 * Consideraciones técnicas:
 * - La vista se basa en un modelo de interacción centrado en el usuario.
 * - No requiere props externas; toda la lógica de estado se gestiona desde el ViewModel.
 */

const meta: Meta<typeof Assistant> = {
  title: "Views/Assistant",
  component: Assistant,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
La vista **Assistant** proporciona un entorno de conversación tipo chatbot dentro de la plataforma **HCC-AI**, pensado para facilitar la ayuda asistida, aclarar dudas sobre la salud hepática, y mejorar la experiencia del usuario.

### Características técnicas:
- Múltiples intercambios de mensajes entre usuario y sistema.
- Área de texto expandible y con envío mediante teclado.
- Scroll automático para mantener visible el último mensaje.
- Indicador visual de procesamiento mientras el modelo genera una respuesta.
- Traducción dinámica mediante \`react-i18next\`.
- Estado controlado a través del hook \`useAssistantViewModel\`.

> Esta vista se puede integrar como módulo de soporte contextual dentro de cualquier sección de la plataforma.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Assistant>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Representación completa de la vista de asistente AI. Muestra el entorno de conversación y lógica de interacción básica con el usuario.",
      },
    },
  },
};
