import React from "react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../../views/Pages/HomePage";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Vista: Dashboard
 *
 * Descripción:
 * `Dashboard` representa la vista principal de inicio dentro de la plataforma **HCC-AI**.
 * Actúa como punto de acceso a las funcionalidades clave del sistema, mostrando accesos directos,
 * tarjetas informativas, enlaces útiles, y estados generales del usuario autenticado.
 *
 * Dependencias:
 * - `react-router-dom`: para el enrutamiento contextual.
 * - `react-i18next`: para internacionalización de textos.
 * - Componentes relacionados: `Navbar`, `Footer`, `ProfileModal`, `UsefulLinks`, `Assistant`, entre otros.
 *
 * Funcionalidades principales:
 * - Muestra información general del usuario (nombre, rol, fecha de ingreso).
 * - Acceso a funcionalidades frecuentes: nuevo estudio, visor de archivos, asistente IA.
 * - Tarjetas de navegación rápida adaptadas al rol del usuario (médico, paciente, administrador).
 * - Vista modular, responsiva y accesible.
 *
 * Consideraciones:
 * - Requiere entorno autenticado para mostrar datos reales del usuario.
 * - Su uso aislado en Storybook debe simular el estado del usuario con mocks o configuración por defecto.
 */

const meta: Meta<typeof Dashboard> = {
  title: "Views/Dashboard",
  component: Dashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
La vista **Dashboard** constituye la página principal de entrada al sistema **HCC-AI**. Está diseñada para ofrecer una visión rápida del estado del usuario 
y facilitar la navegación hacia las principales secciones de la plataforma clínica.

### Funcionalidades clave:
- Visualización diferente según el rol del usuario.
- Enlaces rápidos a estudios recientes, visor de imágenes y configuración.
- Integración del asistente de IA.

### Tecnologías involucradas:
- \`react-router-dom\` para control de rutas.
- \`react-i18next\` para traducción.
- Componentes visuales propios y externos (Tailwind, íconos, etc.).

> Esta vista sirve como punto de partida para el resto de funcionalidades de la plataforma, adaptándose a las preferencias y permisos del usuario autenticado.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Representación de la vista de inicio de sesión activa con usuario autenticado. Contiene accesos rápidos, enlaces útiles y estado general.",
      },
    },
  },
};
