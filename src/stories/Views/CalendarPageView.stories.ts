import type { Meta, StoryObj } from "@storybook/react";
import CalendarPageView from "../../views/Pages/CalendarView";
import { MemoryRouter } from "react-router-dom";

/**
 * Vista: CalendarPageView
 *
 * Descripción:
 * `CalendarPageView` es una vista completa orientada a la gestión de recordatorios personales dentro del entorno clínico de la plataforma HCC-AI.
 * Presenta un calendario mensual interactivo donde el usuario puede visualizar, crear y gestionar eventos, complementado por componentes de soporte
 * como el asistente de IA, configuración de usuario y accesibilidad avanzada.
 *
 * Dependencias:
 * - `useCalendarViewModel`: hook principal que maneja estado y lógica de recordatorios.
 * - `react-router-dom`: necesario para el enrutamiento dentro de la aplicación.
 * - Firebase: backend utilizado para almacenar y recuperar los datos de recordatorios.
 * - Componentes secundarios reutilizados: `NavbarSecond`, `ProfileModal`, `SettingsModal`, `Assistant`, `Footer`.
 *
 * Funcionalidad:
 * - Vista mensual del calendario con marcadores visuales de tareas por día.
 * - Registro, edición, marcado y eliminación de recordatorios personales.
 * - Modal explicativo sobre el significado de los colores y leyendas del calendario.
 * - Integración directa con el asistente AI para soporte contextual.
 * - Soporte para ajustes de accesibilidad (tema, idioma, contraste, escala).
 *
 * Consideraciones técnicas:
 * - Esta vista depende de la autenticación activa del usuario para acceder a los datos personalizados.
 * - Es sensible a las preferencias del usuario, que se integran desde `localStorage` y el perfil de usuario en Firebase.
 */

const meta: Meta<typeof CalendarPageView> = {
  title: "Views/CalendarPageView",
  component: CalendarPageView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
La vista **CalendarPageView** proporciona una interfaz de calendario interactiva y accesible, 
permitiendo al usuario gestionar de forma intuitiva recordatorios asociados a su perfil en la plataforma **HCC-AI**.

### Características técnicas:
- Calendario mensual con eventos codificados por colores.
- Registro, eliminación y marcado de recordatorios diarios.
- Modal informativo sobre el significado visual de los estados.
- Ajustes personalizados mediante acceso a configuración (idioma, zoom, contraste, tema).
- Integración del asistente virtual para asistencia inmediata.
- Uso de múltiples componentes secundarios reutilizables:
  - \`NavbarSecond\`
  - \`Assistant\`
  - \`ProfileModal\`
  - \`SettingsModal\`
  - \`Footer\`

> Esta vista requiere acceso a servicios externos como Firebase y autenticación activa para su funcionamiento completo.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CalendarPageView>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Visualización completa de la vista de calendario. Incluye gestión de recordatorios, accesibilidad, y asistencia AI contextual.",
      },
    },
  },
};
