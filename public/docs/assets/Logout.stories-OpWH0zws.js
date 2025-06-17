import{L as a}from"./Logout-BAZUzOwa.js";import"./iframe-CtcKxV_0.js";import"./AuthDAO-Dq-0zJDM.js";import"./firebase-C7NIwWUw.js";import"./index-DNyRBZ_W.js";import"./useTranslation-BpOnEeka.js";const c={title:"Views/Logout",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
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

        `}}}},e={name:"Vista por defecto",parameters:{docs:{description:{story:"Renderiza el botón de cierre de sesión con icono e internacionalización activa. Recomendado para menús de usuario o barras de navegación."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Renderiza el botón de cierre de sesión con icono e internacionalización activa. Recomendado para menús de usuario o barras de navegación."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const d=["Default"];export{e as Default,d as __namedExportsOrder,c as default};
