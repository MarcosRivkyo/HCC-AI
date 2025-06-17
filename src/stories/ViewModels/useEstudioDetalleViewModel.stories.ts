import type { Meta, StoryObj } from "@storybook/react";

/**
 * Documentación para el ViewModel `useEstudioDetalleViewModel`.
 * 
 * Este ViewModel gestiona toda la lógica relacionada con la vista detallada de un estudio clínico en la plataforma HCC-AI.
 * 
 * Funcionalidades principales:
 * - Carga y manejo de datos del estudio, usuario y permisos.
 * - Gestión de imágenes, predicciones y segmentaciones asociadas.
 * - Generación y descarga de informes PDF con resultados y análisis.
 * - Integración con IA para predicciones y explicaciones automáticas.
 * - Gestión de edición y actualización de datos del estudio.
 * - Control de modales para explicación, email, perfil, leyendas y compartición.
 * - Manejo de preferencias de usuario como tema, idioma, escala y contraste.
 * - Comunicación con múltiples DAOs y servicios externos (Firebase, backend IA, email).
 * 
 * Estados y métodos expuestos:
 * - Información detallada del estudio y sus predicciones.
 * - Estados de carga, edición, subida y visualización.
 * - Funciones para editar, eliminar, compartir, generar PDFs y enviar correos.
 * - Funciones auxiliares para procesamiento de imágenes y análisis IA.
 * 
 * Uso:
 * Este ViewModel es el núcleo lógico de la página detallada del estudio, proporcionando un API completa para la UI y gestionando sincronización con backend y servicios externos.
 */

const DummyComponent = () => null;

const meta: Meta<typeof DummyComponent> = {
  title: "ViewModels/useEstudioDetalleViewModel",
  component: DummyComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ViewModel \`useEstudioDetalleViewModel\` para la gestión integral de la vista detallada de estudios clínicos.

Incluye:
- Carga y control de permisos.
- Gestión de imágenes y datos asociados.
- Integración IA para predicción y explicación.
- Generación y manejo de informes PDF.
- Gestión de preferencias y estado UI.
- Comunicación con servicios backend y Firebase.

Este ViewModel es fundamental para la interacción detallada con estudios dentro de HCC-AI.
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
