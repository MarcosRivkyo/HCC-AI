import{r as s,j as n}from"./iframe-Ce_CfLMD.js";import{u as r}from"./useTranslation-_9OesG3Q.js";const t=()=>{const[o,i]=s.useState(!1),{t:a,i18n:l}=r("global");return s.useEffect(()=>{/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&i(!0)},[]),o?n.jsx("div",{className:"bg-yellow-100 text-yellow-900 p-4 text-sm text-center w-full shadow-md",children:a("warning.pc_optimitation")}):null};t.__docgenInfo={description:"",methods:[],displayName:"MobileWarning"};const u={title:"Components/MobileWarning",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
Componente **MobileWarning** que muestra un mensaje de advertencia si el usuario está en un dispositivo móvil.

- Detecta automáticamente el agente de usuario.
- Muestra una alerta visual usando estilos de Tailwind.
- Traduce el texto usando i18next.
        `}}}},e={parameters:{docs:{description:{story:"Advertencia visual solo en dispositivos móviles. Simula agente móvil en herramientas de desarrollo."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Advertencia visual solo en dispositivos móviles. Simula agente móvil en herramientas de desarrollo."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const p=["Default"];export{e as Default,p as __namedExportsOrder,u as default};
