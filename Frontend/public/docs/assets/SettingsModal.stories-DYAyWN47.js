import{S as o}from"./SettingsModal-BoVG2VdC.js";import"./iframe-CtcKxV_0.js";import"./firebase-C7NIwWUw.js";import"./UserDAO-BKkpcXPq.js";import"./index-BrM8sVuJ.js";import"./clsx-B-dksMZM.js";import"./Modal-DFnHgNOG.js";import"./ChangePasswordForm-0uFzZkqS.js";import"./AuthDAO-Dq-0zJDM.js";import"./useTranslation-BpOnEeka.js";import"./DeleteAccountButton-CQKZjh5H.js";import"./StudyDAO-fVGuTzCR.js";import"./index-DNyRBZ_W.js";const v={title:"Components/SettingsModal",component:o,tags:["autodocs"],args:{open:!0,theme:"light",language:"es",scale:1,highContrast:!1,userData:{rol:"Administrador",email:"admin@example.com",userName:"adminuser",firstName:"Marcos",lastName:"Rivas",phone:"123456789",profilePicture:""}},parameters:{layout:"fullscreen",docs:{description:{component:'\nEl componente **SettingsModal** representa el panel de configuración general de la plataforma HCC-AI. Agrupa, en una única interfaz modal, \nlas secciones relacionadas con la cuenta del usuario, preferencias de visualización, accesibilidad, soporte técnico y funciones administrativas (si aplica).\n\n### Secciones principales:\n- **Cuenta**: Datos personales, cambio de contraseña, eliminación de cuenta.\n- **Preferencias**: Tema, idioma, zoom, alto contraste.\n- **Ayuda**: Manuales y preguntas frecuentes.\n- **Administrador** (solo usuarios autorizados): gestión de usuarios, monitorización de sistema.\n\n### Props principales:\n| Prop               | Tipo                              | Descripción                                        |\n|--------------------|-----------------------------------|----------------------------------------------------|\n| `open`             | `boolean`                         | Controla la visibilidad del modal.                |\n| `onClose`          | `() => void`                     | Cierra el modal.                                  |\n| `theme`            | `"light" | "dark"`               | Tema visual actual.                               |\n| `setTheme`         | `(t: "light" | "dark") => void`   | Cambia el tema.                                   |\n| `language`         | `string`                          | Idioma activo.                                    |\n| `setLanguage`      | `(lang: string) => void`          | Cambia el idioma y lo guarda localmente.          |\n| `scale`            | `number`                          | Nivel de zoom.                                    |\n| `setScale`         | `(val: number) => void`           | Modifica la escala de la interfaz.                |\n| `highContrast`     | `boolean`                         | Activa/desactiva el modo de alto contraste.       |\n| `setHighContrast`  | `(val: boolean) => void`          | Cambia configuración de contraste.                |\n| `userData`         | `object`                          | Datos del usuario (rol, nombre, email, etc.).     |\n\nEste componente está diseñado para mejorar la accesibilidad, personalización y administración de la experiencia del usuario dentro del sistema.\n        '}}}},a={parameters:{docs:{description:{story:"Ejemplo por defecto del modal de configuración, con un usuario administrador que tiene acceso a todas las secciones disponibles."}}}},e={name:"Vista por defecto",args:{userData:{rol:"Paciente",email:"paciente@correo.com",userName:"usuario123",firstName:"Juan",lastName:"Pérez",phone:"987654321"}},parameters:{docs:{description:{story:"Vista del modal de configuración para un usuario sin privilegios de administrador. Se omite la sección administrativa."}}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Ejemplo por defecto del modal de configuración, con un usuario administrador que tiene acceso a todas las secciones disponibles."
      }
    }
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  args: {
    userData: {
      rol: "Paciente",
      email: "paciente@correo.com",
      userName: "usuario123",
      firstName: "Juan",
      lastName: "Pérez",
      phone: "987654321"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Vista del modal de configuración para un usuario sin privilegios de administrador. Se omite la sección administrativa."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const b=["Default","UserNoAdmin"];export{a as Default,e as UserNoAdmin,b as __namedExportsOrder,v as default};
