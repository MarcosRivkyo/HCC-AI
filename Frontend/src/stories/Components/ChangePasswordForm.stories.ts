import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ChangePasswordForm from "../../views/Components/ChangePasswordForm";

/**
 * Componente: ChangePasswordForm
 *
 * Descripción:
 * El componente `ChangePasswordForm` permite a los usuarios solicitar el reinicio de su contraseña a través de un formulario,
 * utilizando como canal de validación el correo electrónico registrado. Es parte del módulo de autenticación de usuarios.
 *
 * Dependencias:
 * - `react-i18next`: para soporte multilenguaje.
 * - `useChangePasswordViewModel`: ViewModel que encapsula la lógica del formulario y gestiona su estado.
 *
 * Funcionalidad:
 * - Muestra un campo para ingresar el correo electrónico.
 * - Informa al usuario del estado de la solicitud (enviado, error, cargando).
 * - La lógica de envío y validación se encuentra desacoplada en un hook personalizado.
 * - No recibe props externas; su funcionamiento es autónomo dentro de la vista.
 */

const meta: Meta<typeof ChangePasswordForm> = {
  title: "Components/ChangePasswordForm",
  component: ChangePasswordForm,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **ChangePasswordForm** permite a los usuarios gestionar el reinicio de su contraseña mediante el envío de un correo electrónico. Su objetivo es ofrecer un mecanismo de recuperación seguro y accesible, integrándose en el flujo de autenticación general de la plataforma.

### Características técnicas:
- Visualiza estados de carga, éxito o error tras el envío de la solicitud.
- Utiliza el ViewModel \`useChangePasswordViewModel\` para desacoplar la lógica de negocio de la capa de presentación.
- Compatible con entornos multilingües mediante \`react-i18next\`.
- No recibe propiedades (\`props\`); su comportamiento y estado están definidos internamente.

Este componente es reutilizable en pantallas de autenticación o recuperación de credenciales.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChangePasswordForm>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Vista por defecto del formulario de recuperación de contraseña. Permite al usuario iniciar el proceso de restablecimiento mediante correo electrónico.",
      },
    },
  },
};
