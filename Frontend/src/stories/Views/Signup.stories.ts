import type { Meta, StoryObj } from "@storybook/react";
import Signup from "../../views/Auth/Signup";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Signup> = {
  title: "Views/Signup",
  component: Signup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Vista: Signup – Registro de Usuario

El componente **Signup** representa el formulario de registro de nuevos usuarios en la plataforma **HCC-AI**.

---

## Funcionalidades principales

- Formulario estructurado con campos obligatorios:
  - Nombre
  - Apellidos
  - Correo electrónico
  - Contraseña y confirmación
  - Rol del usuario (Paciente, Médico, Administrador)
  - Código de acceso (para el rol Médico o Administrador)
  - Teléfono de contacto
- Alternancia de visibilidad de las contraseñas
- Validaciones locales e integración con Firebase Auth
- Componente visual de fondo mediante \`<ImageSlider />\`
- Traducción dinámica con \`react-i18next\`
- Prevención de zoom no deseado con el hook \`usePreventZoom\`

---

## Lógica desacoplada

Utiliza el custom hook \`useSignupViewModel\`, que encapsula:

- Estados de formulario
- Manejo de errores y notificaciones
- Envío de datos y creación de usuario
- Reglas de negocio por rol

---

## Dependencias

- \`react-router-dom\`: navegación post-registro
- \`firebase\`: creación de usuarios
- \`tailwindcss\`: estilos utilitarios responsivos
- \`react-toastify\`: alertas y confirmaciones visuales
- \`react-i18next\`: internacionalización

---

## Consideraciones

Este componente requiere conexión activa a Firebase y entorno autenticado para completar el registro. En modo Storybook, puede simularse con mocks.

        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Signup>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Renderiza el formulario de registro completo, incluyendo campos obligatorios, validaciones y estilos personalizados.",
      },
    },
  },
};
