import{P as a}from"./ProfileModal-CnOjBivl.js";import{l as o}from"./logo_user-DOgDUfrm.js";import"./iframe-CtcKxV_0.js";import"./Modal-DFnHgNOG.js";import"./index-DNyRBZ_W.js";import"./useTranslation-BpOnEeka.js";const d={title:"Components/ProfileModal",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
El componente **ProfileModal** permite mostrar de manera estructurada y accesible la información personal de un usuario autenticado en la plataforma. 
Se presenta como una ventana modal emergente, diseñada para proporcionar un resumen rápido de los principales datos del perfil.

### Características técnicas:
- Visualización de los siguientes campos:
  - Nombre completo
  - Correo electrónico
  - Número de teléfono (si está disponible)
  - Fecha de creación de la cuenta
  - Rol del usuario (médico, paciente o administrador)
- Iconografía específica según el tipo de rol utilizando \`react-icons\`.
- Imagen de perfil personalizada en caso de estar definida.
- Traducción automática de etiquetas mediante \`react-i18next\`.
- Utiliza un componente \`Modal\` interno que controla la visibilidad del cuadro emergente.

Este componente puede integrarse en cualquier layout donde se requiera acceso rápido a los datos del usuario actual.
        `}}}},e={name:"Vista por defecto",args:{isOpen:!0,onClose:()=>console.log("Modal cerrado"),user:{displayName:"Dr. Marcos Rivas",email:"marcos.rivas@ejemplo.com",photoURL:o},userData:{firstName:"Marcos",lastName:"Rivas",email:"marcos.rivas@ejemplo.com",phone:"+34 600 123 456",rol:"Médico",profilePicture:o,createdAt:{toDate:()=>new Date("2023-02-15T10:30:00")}}},parameters:{docs:{description:{story:"Ejemplo de uso del modal de perfil, mostrando información simulada de un usuario autenticado con rol médico."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
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
        story: "Ejemplo de uso del modal de perfil, mostrando información simulada de un usuario autenticado con rol médico."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const l=["Default"];export{e as Default,l as __namedExportsOrder,d as default};
