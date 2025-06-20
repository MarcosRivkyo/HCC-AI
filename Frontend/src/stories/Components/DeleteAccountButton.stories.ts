import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import DeleteAccountButton from "../../views/Components/DeleteAccountButton";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

/**
 * Componente: DeleteAccountButton
 *
 * Descripción:
 * El componente `DeleteAccountButton` permite a los usuarios eliminar de forma definitiva su cuenta del sistema,
 * previo proceso de confirmación explícita por parte del usuario. Su uso está orientado a secciones de configuración avanzada o gestión de cuenta.
 *
 * Dependencias:
 * - `useDeleteAccountViewModel`: ViewModel que gestiona la lógica de borrado de cuenta, reautenticación y control de errores.
 * - `react-i18next`: para traducción de la interfaz y del texto de confirmación.
 * - `react-router-dom`: requerido para redireccionamiento tras la eliminación.
 *
 * Funcionalidad:
 * - Muestra un campo de confirmación donde el usuario debe escribir una palabra clave específica (e.g. "ELIMINAR") para activar el botón.
 * - Valida la confirmación y ejecuta el proceso de eliminación llamando a servicios backend.
 * - Informa al usuario en caso de errores (por ejemplo, autenticación fallida o fallo en el servidor).
 * - Proporciona soporte multilingüe y control de estados de carga.
 */

const meta: Meta<typeof DeleteAccountButton> = {
  title: "Components/DeleteAccountButton",
  component: DeleteAccountButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **DeleteAccountButton** permite al usuario eliminar permanentemente su cuenta de la plataforma, 
previa verificación textual mediante una palabra clave específica. Este mecanismo previene eliminaciones accidentales 
y garantiza que la acción sea intencionada.

### Características técnicas:
- Requiere una cadena de confirmación "borrar".
- Gestiona reautenticación y comunicación con el backend mediante el ViewModel \`useDeleteAccountViewModel\`.
- Muestra mensajes informativos ante errores de validación o del servidor.
- Incorpora soporte para traducción de interfaz con \`react-i18next\`.
- Compatible con redirecciones mediante \`react-router-dom\`.

Este componente se recomienda únicamente en interfaces donde el usuario tiene total control sobre su cuenta y ha sido debidamente advertido de las consecuencias.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeleteAccountButton>;

export const Default: Story = {
  name: "Vista por defecto",  
  parameters: {
    docs: {
      description: {
        story: "Botón que permite al usuario eliminar su cuenta previa confirmación textual. Se utiliza en secciones de configuración avanzada del perfil.",
      },
    },
  },
};
