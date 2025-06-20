import{D as a}from"./DeleteAccountButton-CQKZjh5H.js";import"./iframe-CtcKxV_0.js";import"./firebase-C7NIwWUw.js";import"./UserDAO-BKkpcXPq.js";import"./StudyDAO-fVGuTzCR.js";import"./useTranslation-BpOnEeka.js";const s={title:"Components/DeleteAccountButton",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
El componente **DeleteAccountButton** permite al usuario eliminar permanentemente su cuenta de la plataforma, 
previa verificación textual mediante una palabra clave específica. Este mecanismo previene eliminaciones accidentales 
y garantiza que la acción sea intencionada.

### Características técnicas:
- Requiere una cadena de confirmación "borrar".
- Gestiona reautenticación y comunicación con el backend mediante el ViewModel \`useDeleteAccountViewModel\`.
- Muestra mensajes informativos ante errores de validación o del servidor.
- Incorpora soporte para traducción de interfaz con \`react-i18next\`.
- Compatible con redirecciones mediante \`react-router-dom\`.

Este componente se recomienda únicamente en interfaces donde el usuario tiene total control sobre su cuenta y ha sido debidamente advertido de las consecuencias.
        `}}}},e={name:"Vista por defecto",parameters:{docs:{description:{story:"Botón que permite al usuario eliminar su cuenta previa confirmación textual. Se utiliza en secciones de configuración avanzada del perfil."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Botón que permite al usuario eliminar su cuenta previa confirmación textual. Se utiliza en secciones de configuración avanzada del perfil."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const u=["Default"];export{e as Default,u as __namedExportsOrder,s as default};
