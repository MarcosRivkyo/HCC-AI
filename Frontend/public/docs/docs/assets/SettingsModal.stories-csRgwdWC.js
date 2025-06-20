import{S as o}from"./SettingsModal-owpSk7Z7.js";import"./iframe-Ce_CfLMD.js";import"./firebase-BFVMFqfP.js";import"./UserDAO-VV-yXTrd.js";import"./index-BW6WDUaj.js";import"./clsx-B-dksMZM.js";import"./Modal-B-XMGiyu.js";import"./ChangePasswordForm-CElQ-ZPk.js";import"./AuthDAO-DmWoopg-.js";import"./useTranslation-_9OesG3Q.js";import"./DeleteAccountButton-CrU8KWZc.js";import"./StudyDAO-FPAlLphV.js";import"./index-BZiZ2ILP.js";const b={title:"Components/SettingsModal",component:o,tags:["autodocs"],args:{open:!0,theme:"light",language:"es",scale:1,highContrast:!1,userData:{rol:"Administrador",email:"admin@example.com",userName:"adminuser",firstName:"Marcos",lastName:"Rivas",phone:"123456789",profilePicture:""}},parameters:{layout:"fullscreen",docs:{description:{component:'\n# 🛠 Componente: SettingsModal\n\nEl componente `SettingsModal` es un modal configurable que agrupa todas las opciones de configuración del usuario y del sistema HCC-AI. Incluye gestión de cuenta, preferencias de visualización, accesibilidad, idioma, y panel de administración (si el usuario es administrador).\n\n---\n\n## 🧩 Secciones incluidas\n\n- **Cuenta**: Información del perfil, cambio de datos, cambio de contraseña y eliminación.\n- **Preferencias**: Tema, idioma, escala de UI, accesibilidad y recordatorios por correo.\n- **Ayuda**: Estado del sistema, manual de usuario y preguntas frecuentes.\n- **Administrador**: Gestión de usuarios y estado del sistema.\n\n---\n\n## 🔧 Props\n\n| Prop             | Tipo                              | Descripción                                            |\n|------------------|-----------------------------------|--------------------------------------------------------|\n| `open`           | `boolean`                         | Controla si el modal está visible.                     |\n| `onClose`        | `() => void`                     | Función para cerrar el modal.                          |\n| `theme`          | `"light" | "dark"`               | Tema actual del sistema.                              |\n| `setTheme`       | `(theme: "light" | "dark") => void` | Cambia el tema.                                       |\n| `language`       | `string`                          | Idioma actual.                                         |\n| `setLanguage`    | `(lang: string) => void`          | Cambia el idioma y lo guarda en localStorage.         |\n| `scale`          | `number`                          | Escala de interfaz (zoom).                            |\n| `setScale`       | `(val: number) => void`           | Ajusta el zoom de la interfaz.                        |\n| `highContrast`   | `boolean`                         | Habilita modo de alto contraste.                      |\n| `setHighContrast`| `(val: boolean) => void`          | Activa/desactiva el alto contraste.                   |\n| `userData`       | `any` (con campos estructurados) | Datos del usuario (email, rol, nombre, imagen, etc).  |\n\n---\n\n## 🧠 Internamente usa:\n\n- `useSettingsViewModel`: lógica y estado compartido para todo el panel.\n- `Modal`: componente base reutilizable.\n- `ChangePasswordForm` y `DeleteAccountButton`: componentes encapsulados.\n- `react-i18next`: soporte multilingüe.\n- `TailwindCSS`: diseño responsivo y adaptado a modo oscuro.\n\n---\n\n## 🧪 Consideraciones\n\n- Muestra automáticamente secciones según el rol del usuario.\n- Usa localStorage para persistencia de preferencias.\n- Requiere integración real para persistencia de cambios (firebase).\n\n        '}}}},e={parameters:{docs:{description:{story:"Modal de configuración visible con datos simulados de un usuario administrador."}}}},a={args:{userData:{rol:"Paciente",email:"paciente@correo.com",userName:"usuario123",firstName:"Juan",lastName:"Pérez",phone:"987654321"}},parameters:{docs:{description:{story:"Vista del modal con un usuario que no tiene privilegios de administrador."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Modal de configuración visible con datos simulados de un usuario administrador."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
        story: "Vista del modal con un usuario que no tiene privilegios de administrador."
      }
    }
  }
}`,...a.parameters?.docs?.source}}};const y=["Default","UserNoAdmin"];export{e as Default,a as UserNoAdmin,y as __namedExportsOrder,b as default};
