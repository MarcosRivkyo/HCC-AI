import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import FilesPage from "../../views/Pages/FileView";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Vista: FilesPage
 *
 * Descripción:
 * `FilesPage` es una vista dedicada a la gestión de documentos clínicos e imágenes médicas dentro de la plataforma HCC-AI.
 * Permite a los usuarios visualizar, organizar y editar archivos cargados, agrupados por categoría o tipo de estudio.
 *
 * Dependencias:
 * - `Firebase Auth` y `Firestore`: utilizados para la autenticación del usuario y la recuperación de archivos desde la base de datos.
 * - `react-router-dom`: para la integración en el sistema de navegación de la aplicación.
 * - `react-i18next`: para traducción de la interfaz.
 * - `react-toastify`: para la notificación de acciones exitosas o con error.
 * - Componentes secundarios: `Assistant`, `SettingsModal`, `ProfileModal`, entre otros.
 *
 * Funcionalidad:
 * - Listado de archivos clínicos agrupados por tipo o categoría.
 * - Paginación para grandes volúmenes de documentos.
 * - Vista previa de imágenes y documentos.
 * - Edición de metadatos asociados a cada archivo.
 * - Eliminación y gestión segura de documentos.
 * - Integración del asistente AI para búsqueda o consulta contextual.
 * - Soporte completo para accesibilidad: escalado, contraste, idioma, etc.
 *
 * Consideraciones técnicas:
 * - Esta vista depende del contexto de usuario autenticado.
 * - Requiere conexión activa a Firestore para mostrar datos reales.
 * - Su ejecución aislada en Storybook requiere mocks del estado de aplicación.
 */

const meta: Meta<typeof FilesPage> = {
  title: "Views/FilesPage",
  component: FilesPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
La vista **FilesPage** permite la gestión centralizada de archivos clínicos e imágenes médicas dentro de la plataforma **HCC-AI**.

### Funcionalidades principales:
- Agrupación de archivos por tipo.
- Vista previa interactiva.
- Edición y eliminación de archivos.
- Paginación para navegación en grandes volúmenes.
- Modales para metadatos.
- Asistente integrado con capacidad contextual.
- Notificaciones al usuario mediante \`react-toastify\`.

### Tecnologías relacionadas:
- Firebase para autenticación y base de datos.
- Diseño adaptativo con soporte para accesibilidad.
- Integración con componentes como \`Assistant\`, \`SettingsModal\` y \`ProfileModal\`.

        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FilesPage>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Vista principal de gestión de archivos clínicos. Incluye funcionalidades de visualización, edición y soporte asistido por IA.",
      },
    },
  },
};
