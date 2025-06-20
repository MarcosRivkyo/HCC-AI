import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import UsefulLinks from "../../views/Components/UsefulLinks";

/**
 * Componente: UsefulLinks
 *
 * Descripción:
 * `UsefulLinks` es un componente interactivo que permite a los usuarios añadir, visualizar y eliminar enlaces personalizados 
 * considerados de utilidad dentro del contexto clínico, académico o informativo. Ofrece soporte para la carga de iconos y una experiencia visual clara y responsiva.
 *
 * Dependencias:
 * - `react-i18next`: para traducción de la interfaz (namespace: `global`).
 * - `react-icons`: para iconos interactivos como el botón de carga (`FaUpload`).
 * - `tailwindcss`: para estructura de diseño, estilo y compatibilidad con tema oscuro.
 *
 * Funcionalidad:
 * - Permite ingresar manualmente el nombre y la URL de un enlace personalizado.
 * - Admite la carga de una imagen o icono representativo del enlace, que se previsualiza inmediatamente.
 * - Muestra todos los enlaces agregados en formato de tarjeta visual, con opción de eliminación individual.
 * - Abre los enlaces en una nueva pestaña al hacer clic.
 *
 * ViewModel utilizado:
 * - `useUsefulLinksViewModel(userId)`, el cual expone:
 *   - `links`: lista de enlaces del usuario.
 *   - `newLink`: estado temporal del formulario de entrada.
 *   - `addLink()`: añade un nuevo enlace.
 *   - `removeLink(index)`: elimina un enlace existente.
 *   - `handleIconUpload()`: gestiona la subida y previsualización del icono.
 *   - `fileInputRef`: referencia para el control de carga de archivos.
 *
 * Consideraciones:
 * - Requiere el `userId` como identificador único del usuario para asociar los enlaces.
 * - El diseño es completamente responsivo, adaptándose a dispositivos móviles y pantallas de escritorio.
 * - Los efectos visuales incluyen transiciones suaves y soporte para modo oscuro.
 */

const meta: Meta<typeof UsefulLinks> = {
  title: "Components/UsefulLinks",
  component: UsefulLinks,
  tags: ['autodocs'],
  args: {
    userId: "123456", // ID simulado para pruebas en Storybook
  },
  parameters: {
    docs: {
      description: {
        component: `
El componente **UsefulLinks** proporciona al usuario una herramienta para gestionar enlaces personalizados que pueden resultar útiles en su experiencia dentro de la plataforma.

### Funcionalidades destacadas:
- Creación manual de enlaces con nombre, dirección y opción de icono visual.
- Subida y previsualización de íconos personalizados.
- Eliminación individual de enlaces.
- Navegación directa en una nueva pestaña.
- Interfaz multilingüe a través de \`react-i18next\`.

### Props esperadas:
| Prop     | Tipo     | Descripción                                                 |
|----------|----------|-------------------------------------------------------------|
| \`userId\` | \`string\` | Identificador único del usuario propietario de los enlaces. |

Este componente puede integrarse dentro de paneles de usuario o dashboards personalizados y se adapta automáticamente a cualquier resolución o preferencia de tema visual.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UsefulLinks>;

export const Default: Story = {
  name: "Vista por defecto",  
  parameters: {
    docs: {
      description: {
        story: "Demostración del componente con controles activos para agregar, visualizar y eliminar enlaces útiles definidos por el usuario.",
      },
    },
  },
};
