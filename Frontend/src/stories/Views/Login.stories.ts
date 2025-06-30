import type { Meta, StoryObj } from "@storybook/react";
import Login from "../../views/Auth/Login";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Login> = {
  title: "Views/Login",
  component: Login,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Componente: Login

El componente **Login** define la interfaz principal de autenticación para los usuarios de la plataforma **HCC-AI**. Permite el acceso seguro al sistema mediante correo electrónico y contraseña, e integra funcionalidades adicionales para la experiencia del usuario.

---

## Funcionalidades principales:

- Campos de entrada para credenciales:
  - Dirección de correo electrónico
  - Contraseña (con opción para mostrar u ocultar)
- Botón de envío de formulario con validación básica
- Botñon para la recuperación de contraseña
- Componente visual \`ImageSlider\` como elemento decorativo
- Prevención del zoom no deseado mediante combinaciones de teclado y scroll
- Feedback visual de carga y errores
- Traducción dinámica con \`react-i18next\`

---

## Lógica encapsulada:

Se gestiona mediante el hook personalizado \`useLoginViewModel\`, que abstrae la lógica de negocio y controla:

- Validación de campos
- Gestión del estado de carga y errores
- Comunicación con servicios de autenticación
- Eventos de cambio en los inputs

---

## Dependencias utilizadas:

- \`react-router-dom\` para redireccionamientos tras inicio de sesión
- \`react-i18next\` para internacionalización
- \`tailwindcss\` para diseño responsivo
- \`ImageSlider\` para elementos gráficos dinámicos
- \`usePreventZoom\` para bloquear combinaciones Ctrl + scroll / Ctrl + +/- 

---

## Observaciones:

Este componente debe ser renderizado dentro de un proveedor de rutas (\`<MemoryRouter>\` o similar) y con contexto de traducción activo para su correcto funcionamiento.

        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Renderiza el formulario de autenticación con campos para correo y contraseña, control de visibilidad y enlace a recuperación.",
      },
    },
  },
};
