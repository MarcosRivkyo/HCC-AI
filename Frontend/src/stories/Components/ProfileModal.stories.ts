import type { Meta, StoryObj } from "@storybook/react";
import ProfileModal from "../../views/Components/ProfileModal";
import logo_user from "../../assets/images/logo_user.png";

/**
 * Componente: ProfileModal
 *
 * Descripción:
 * `ProfileModal` es un componente modal diseñado para mostrar información resumida del perfil de usuario dentro de la plataforma.
 * Se utiliza como un elemento de consulta rápida accesible desde la navegación principal o desde secciones de configuración de cuenta.
 *
 * Dependencias:
 * - `Modal`: componente contenedor que gestiona la apertura/cierre del diálogo modal.
 * - `react-icons`: para iconografía asociada al rol del usuario.
 * - `react-i18next`: para traducción dinámica del contenido textual.
 *
 * Funcionalidad:
 * - Visualiza los datos principales del usuario: nombre, correo electrónico, teléfono, fecha de registro y rol en la plataforma.
 * - Muestra una imagen de perfil personalizada si está disponible.
 * - Representa visualmente el rol del usuario con un icono específico.
 * - Adapta su contenido a diferentes idiomas mediante el sistema de internacionalización.
 */

const meta: Meta<typeof ProfileModal> = {
  title: "Components/ProfileModal",
  component: ProfileModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **ProfileModal** permite mostrar de manera estructurada y accesible la información personal de un usuario autenticado en la plataforma. 
Se presenta como una ventana modal emergente, diseñada para proporcionar un resumen rápido de los principales datos del perfil.

### Características técnicas:
- Visualización de los siguientes campos:
  - Nombre completo
  - Correo electrónico
  - Número de teléfono (si está disponible)
  - Fecha de creación de la cuenta
  - Rol del usuario (médico, paciente o administrador)
- Iconografía específica según el tipo de rol utilizando \`react-icons\`.
- Imagen de perfil personalizada en caso de estar definida.
- Traducción automática de etiquetas mediante \`react-i18next\`.
- Utiliza un componente \`Modal\` interno que controla la visibilidad del cuadro emergente.

Este componente puede integrarse en cualquier layout donde se requiera acceso rápido a los datos del usuario actual.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileModal>;

export const Default: Story = {
  name: "Vista por defecto",
  args: {
    isOpen: true,
    onClose: () => console.log("Modal cerrado"),
    user: {
      displayName: "Dr. Marcos Rivas",
      email: "marcos.rivas@ejemplo.com",
      photoURL: logo_user,
    },
    userData: {
      firstName: "Marcos",
      lastName: "Rivas",
      email: "marcos.rivas@ejemplo.com",
      phone: "+34 600 123 456",
      rol: "Médico",
      profilePicture: logo_user,
      createdAt: {
        toDate: () => new Date("2023-02-15T10:30:00"),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo de uso del modal de perfil, mostrando información simulada de un usuario autenticado con rol médico.",
      },
    },
  },
};
