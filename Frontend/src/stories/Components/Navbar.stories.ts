import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "../../views/Components/AppNavbar";

/**
 * Componente: Navbar
 *
 * Descripción:
 * `Navbar` es el componente de navegación principal de la plataforma HCC-AI.
 * Proporciona acceso estructurado a las distintas secciones del sistema y se adapta dinámicamente según el estado de autenticación del usuario.
 *
 * Dependencias:
 * - `react-router-dom`: para navegación programática con `navigate()`.
 * - `react-i18next`: para traducción de etiquetas y secciones.
 * - `react-icons`: para iconografía de acciones como inicio de sesión o cierre de sesión.
 * - `tailwindcss`: para diseño responsivo y estilo utilitario.
 * - `useAppNavbarViewModel`: encapsula la lógica de comportamiento del componente.
 *
 * Funcionalidad:
 * - Muestra enlaces de navegación estáticos o condicionales según el rol y estado de sesión.
 * - Soporta navegación por anclaje (scroll) dentro de una misma vista.
 * - Incluye lógica para alternar menú desplegable en dispositivos móviles.
 * - Integra el componente `<Logout />` para finalizar sesión de usuario.
 * - Utiliza un ViewModel personalizado para gestionar el estado del menú, usuario, navegación y lógica asociada.
 */

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **Navbar** representa la barra superior de navegación persistente de la plataforma web **HCC-AI**. 
Permite al usuario acceder a las diferentes secciones públicas y privadas del sistema, mostrando contenido adaptado según su estado de autenticación.

### Características técnicas:
- Internacionalización mediante \`react-i18next\`.
- Comportamiento condicional según el estado de autenticación del usuario.
- Soporte para navegación por anclas con desplazamiento suave (\`scrollToSection\`).
- Diseño adaptativo: incluye menú hamburguesa en dispositivos móviles.
- Gestión de sesión: incluye botón de cierre con el componente \`<Logout />\`.
- La lógica del componente se encuentra desacoplada en el ViewModel \`useAppNavbarViewModel\`, que expone:
  - Estado del menú y visibilidad (isOpen, mobileMenuOpen)
  - Datos del usuario (user,userData)
  - Funciones de navegación (navigate, scrollToSection)

Este componente es esencial en la arquitectura de navegación y se utiliza en todas las vistas principales de la aplicación.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Vista por defecto del componente de navegación. Presenta enlaces generales y opciones de inicio de sesión si el usuario no está autenticado.",
      },
    },
  },
};
