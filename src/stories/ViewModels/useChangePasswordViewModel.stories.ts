import type { Meta, StoryObj } from "@storybook/react";

/**
 * Documentación para el ViewModel `useChangePasswordViewModel`.
 * 
 * Este ViewModel gestiona la lógica relacionada con la solicitud de restablecimiento
 * de contraseña para usuarios autenticados en la plataforma HCC-AI.
 * 
 * Funcionalidades principales:
 * - Controla estados de carga, error y éxito en la petición.
 * - Utiliza el servicio AuthDAO para enviar el email de restablecimiento.
 * - Soporta internacionalización con `react-i18next`.
 * 
 * Estados y métodos expuestos:
 * - `loading`: indica si la solicitud está en proceso.
 * - `error`: mensaje de error si ocurre algún fallo.
 * - `successMessage`: mensaje de éxito tras enviar el email.
 * - `handlePasswordReset`: función para iniciar el proceso de restablecimiento.
 * 
 * Uso:
 * Integrar en formularios de cambio o recuperación de contraseña, mostrando
 * feedback adecuado según el resultado de la operación.
 */

const DummyComponent = () => null;

const meta: Meta<typeof DummyComponent> = {
  title: "ViewModels/useChangePasswordViewModel",
  component: DummyComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useChangePasswordViewModel\` para gestionar el proceso de restablecimiento de contraseña.

Incluye:
- Gestión del estado de carga y mensajes de error o éxito.
- Comunicación con \`AuthDAO\` para envío de email.
- Internacionalización con \`react-i18next\`.

Es fundamental para el módulo de configuración de cuenta en HCC-AI.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DummyComponent>;

export const Documentation: Story = {
  name: "Documentación",
};
