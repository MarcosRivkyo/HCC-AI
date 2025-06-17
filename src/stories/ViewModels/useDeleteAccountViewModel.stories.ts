import type { Meta, StoryObj } from "@storybook/react";

/**
 * Documentación para el ViewModel `useDeleteAccountViewModel`.
 * 
 * Este ViewModel gestiona la lógica completa para la eliminación de la cuenta de usuario
 * en la plataforma HCC-AI, incluyendo la eliminación de archivos, estudios, autenticación
 * y manejo de reautenticación cuando es necesario.
 * 
 * Funcionalidades principales:
 * - Control de estados de carga y errores.
 * - Eliminación recursiva de archivos en Firebase Storage.
 * - Borrado de estudios y predicciones asociadas.
 * - Eliminación de datos de usuario en Firestore.
 * - Eliminación de cuenta en Firebase Auth.
 * - Gestión de reautenticación en caso de sesión no reciente.
 * - Uso de confirmaciones y prompts para seguridad.
 * - Navegación post-eliminación.
 * 
 * Estados y métodos expuestos:
 * - `loading`: estado de operación en progreso.
 * - `error`: mensaje de error.
 * - `setError`: función para limpiar o establecer errores manualmente.
 * - `handleDeleteAccount`: función principal para iniciar el borrado completo.
 * - `reauthenticateAndDelete`: función para reautenticación y eliminación en caso de error.
 * 
 * Uso:
 * Integrar en formularios o componentes de configuración de cuenta con controles adecuados
 * para confirmación y feedback visual al usuario.
 */

const DummyComponent = () => null;

const meta: Meta<typeof DummyComponent> = {
  title: "ViewModels/useDeleteAccountViewModel",
  component: DummyComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useDeleteAccountViewModel\` para gestionar el proceso completo de eliminación de cuenta.

Incluye:
- Eliminación recursiva de archivos y datos relacionados.
- Manejo de sesión y reautenticación para cumplimiento de seguridad Firebase.
- Feedback al usuario mediante mensajes de error y éxito.
- Navegación tras finalización.

Este ViewModel es esencial para funciones críticas de administración de usuario en HCC-AI.
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
