import type { Meta, StoryObj } from "@storybook/react";
import Logout from "../../views/Auth/Logout";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Logout> = {
  title: "Views/Logout",
  component: Logout,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
# Componente: Logout

El componente **Logout** permite a un usuario autenticado cerrar su sesión de forma segura dentro de la plataforma **HCC-AI**.

---

## Funcionalidades principales

- Botón interactivo con etiqueta textual e icono visual.
- Ejecuta el cierre de sesión utilizando el hook \`useLogoutViewModel\`.
- Traducción automática del texto mediante el sistema de internacionalización \`react-i18next\`.
- Diseño adaptable mediante clases utilitarias de \`TailwindCSS\`.

---

## Dependencias

- \`react-i18next\`: para traducción dinámica.
- \`react-icons\`: uso del icono \`FaSignOutAlt\` como representación visual del logout.
- \`useLogoutViewModel\`: hook personalizado que encapsula la lógica de cierre de sesión.
- \`react-router-dom\`: contexto necesario para manejar redirecciones tras cerrar sesión.

---

## Consideraciones

Este componente no recibe props. Está diseñado para integrarse de forma directa en menús de navegación o encabezados que requieran una opción de cerrar sesión. Se recomienda envolverlo dentro de un proveedor de rutas como \`<MemoryRouter>\` cuando se renderiza de forma aislada en Storybook.

        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logout>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Renderiza el botón de cierre de sesión con icono e internacionalización activa. Recomendado para menús de usuario o barras de navegación.",
      },
    },
  },
};
