import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import SettingsModal from "../../views/Components/SettingsModal";

/**
 * Componente: SettingsModal
 *
 * Descripción:
 * `SettingsModal` es un componente de configuración general para la plataforma HCC-AI. Se presenta como una ventana modal 
 * que agrupa todas las preferencias del usuario y opciones administrativas, permitiendo personalizar la experiencia de uso 
 * de forma integral.
 *
 * Dependencias:
 * - `useSettingsViewModel`: hook que centraliza el estado y lógica de interacción.
 * - `Modal`: componente base para contenedores modales reutilizables.
 * - `ChangePasswordForm`, `DeleteAccountButton`: componentes internos especializados.
 * - `react-i18next`: para internacionalización.
 * - `TailwindCSS`: para diseño adaptativo, modo oscuro y estilos responsivos.
 *
 * Funcionalidad:
 * - Presenta información de cuenta y permite modificar nombre, contraseña y datos de perfil.
 * - Configura preferencias visuales: idioma, tema (claro/oscuro), escala y accesibilidad (alto contraste).
 * - Incluye herramientas de ayuda y, para usuarios con rol de administrador, funciones adicionales de gestión del sistema.
 * - Persiste configuraciones en `localStorage` y requiere integración con backend para cambios reales.
 */

const meta: Meta<typeof SettingsModal> = {
  title: "Components/SettingsModal",
  component: SettingsModal,
  tags: ['autodocs'],
  args: {
    open: true,
    theme: "light",
    language: "es",
    scale: 1,
    highContrast: false,
    userData: {
      rol: "Administrador",
      email: "admin@example.com",
      userName: "adminuser",
      firstName: "Marcos",
      lastName: "Rivas",
      phone: "123456789",
      profilePicture: "",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
El componente **SettingsModal** representa el panel de configuración general de la plataforma HCC-AI. Agrupa, en una única interfaz modal, 
las secciones relacionadas con la cuenta del usuario, preferencias de visualización, accesibilidad, soporte técnico y funciones administrativas (si aplica).

### Secciones principales:
- **Cuenta**: Datos personales, cambio de contraseña, eliminación de cuenta.
- **Preferencias**: Tema, idioma, zoom, alto contraste.
- **Ayuda**: Manuales y preguntas frecuentes.
- **Administrador** (solo usuarios autorizados): gestión de usuarios, monitorización de sistema.

### Props principales:
| Prop               | Tipo                              | Descripción                                        |
|--------------------|-----------------------------------|----------------------------------------------------|
| \`open\`             | \`boolean\`                         | Controla la visibilidad del modal.                |
| \`onClose\`          | \`() => void\`                     | Cierra el modal.                                  |
| \`theme\`            | \`"light" | "dark"\`               | Tema visual actual.                               |
| \`setTheme\`         | \`(t: "light" | "dark") => void\`   | Cambia el tema.                                   |
| \`language\`         | \`string\`                          | Idioma activo.                                    |
| \`setLanguage\`      | \`(lang: string) => void\`          | Cambia el idioma y lo guarda localmente.          |
| \`scale\`            | \`number\`                          | Nivel de zoom.                                    |
| \`setScale\`         | \`(val: number) => void\`           | Modifica la escala de la interfaz.                |
| \`highContrast\`     | \`boolean\`                         | Activa/desactiva el modo de alto contraste.       |
| \`setHighContrast\`  | \`(val: boolean) => void\`          | Cambia configuración de contraste.                |
| \`userData\`         | \`object\`                          | Datos del usuario (rol, nombre, email, etc.).     |

Este componente está diseñado para mejorar la accesibilidad, personalización y administración de la experiencia del usuario dentro del sistema.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SettingsModal>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Ejemplo por defecto del modal de configuración, con un usuario administrador que tiene acceso a todas las secciones disponibles.",
      },
    },
  },
};

export const UserNoAdmin: Story = {
  name: "Vista por defecto",  
  args: {
    userData: {
      rol: "Paciente",
      email: "paciente@correo.com",
      userName: "usuario123",
      firstName: "Juan",
      lastName: "Pérez",
      phone: "987654321",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Vista del modal de configuración para un usuario sin privilegios de administrador. Se omite la sección administrativa.",
      },
    },
  },
};
