import type { Meta, StoryObj } from "@storybook/react";

/**
 * Documentación para el ViewModel `useCalendarViewModel`.
 *
 * Este ViewModel gestiona la lógica y estado de la vista de calendario y recordatorios en la plataforma HCC-AI.
 *
 * Funcionalidades principales:
 * - Gestión del usuario autenticado y sus datos.
 * - Carga y actualización de recordatorios según el mes y la fecha seleccionada.
 * - Añadir, eliminar y marcar recordatorios como completados.
 * - Sincronización con DAOs para persistencia y recuperación de datos.
 *
 * Estados y métodos expuestos:
 * - user, userData: información del usuario.
 * - reminders: lista de recordatorios.
 * - selectedDate: fecha activa en el calendario.
 * - newReminder: texto del nuevo recordatorio.
 * - funciones para modificar estados y realizar acciones CRUD sobre recordatorios.
 *
 * Uso:
 * Este ViewModel es utilizado por la vista de calendario para mantener sincronía entre UI y datos,
 * facilitando la gestión eficiente y reactiva de recordatorios personales.
 */

// Componente vacío para mostrar solo documentación
const DummyComponent = () => null;

const meta: Meta<typeof DummyComponent> = {
  title: "ViewModels/useCalendarViewModel",
  component: DummyComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useCalendarViewModel\` para la gestión avanzada de recordatorios en la vista de calendario.

Incluye:
- Control de autenticación y datos de usuario.
- Manipulación de recordatorios (crear, eliminar, marcar completados).
- Actualización automática de recordatorios al cambiar la fecha.
- Integración con DAOs para persistencia de datos.

Este ViewModel es fundamental para la funcionalidad del módulo de calendario dentro de HCC-AI.
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
