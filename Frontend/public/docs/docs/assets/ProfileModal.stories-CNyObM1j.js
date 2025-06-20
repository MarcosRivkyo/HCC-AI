import{P as a}from"./ProfileModal-vmQfYRl8.js";import{l as o}from"./logo_user-DOgDUfrm.js";import"./iframe-Ce_CfLMD.js";import"./Modal-B-XMGiyu.js";import"./index-BZiZ2ILP.js";import"./useTranslation-_9OesG3Q.js";const l={title:"Components/ProfileModal",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
El componente **ProfileModal** muestra un resumen de la información de usuario en un modal emergente.

### Características:
- Visualización de nombre, correo, fecha de registro y rol.
- Íconos específicos por tipo de usuario (médico, paciente, administrador).
- Usa la imagen de perfil personalizada si está disponible.
- Traducción automática con \`react-i18next\`.

### Dependencias:
- \`Modal\`: componente contenedor personalizado.
- \`react-icons\` para representar roles.
        `}}}},e={args:{isOpen:!0,onClose:()=>console.log("Modal cerrado"),user:{displayName:"Dr. Marcos Rivas",email:"marcos.rivas@ejemplo.com",photoURL:o},userData:{firstName:"Marcos",lastName:"Rivas",email:"marcos.rivas@ejemplo.com",phone:"+34 600 123 456",rol:"Médico",profilePicture:o,createdAt:{toDate:()=>new Date("2023-02-15T10:30:00")}}},parameters:{docs:{description:{story:"Modal de perfil con información completa del usuario simulado."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log("Modal cerrado"),
    user: {
      displayName: "Dr. Marcos Rivas",
      email: "marcos.rivas@ejemplo.com",
      photoURL: logo_user
    },
    userData: {
      firstName: "Marcos",
      lastName: "Rivas",
      email: "marcos.rivas@ejemplo.com",
      phone: "+34 600 123 456",
      rol: "Médico",
      profilePicture: logo_user,
      createdAt: {
        toDate: () => new Date("2023-02-15T10:30:00")
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Modal de perfil con información completa del usuario simulado."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const m=["Default"];export{e as Default,m as __namedExportsOrder,l as default};
