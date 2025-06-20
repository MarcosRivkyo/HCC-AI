import{r as i,j as n}from"./iframe-CtcKxV_0.js";import{u as r}from"./useTranslation-BpOnEeka.js";const a=()=>{const[s,o]=i.useState(!1),{t,i18n:c}=r("global");return i.useEffect(()=>{/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&o(!0)},[]),s?n.jsx("div",{className:"bg-yellow-100 text-yellow-900 p-4 text-sm text-center w-full shadow-md",children:t("warning.pc_optimitation")}):null};a.__docgenInfo={description:"",methods:[],displayName:"MobileWarning"};const m={title:"Components/MobileWarning",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
El componente **MobileWarning** proporciona una advertencia visual cuando el sistema detecta que el usuario accede desde un dispositivo móvil. 
Está pensado para informar sobre posibles limitaciones o incompatibilidades en resoluciones pequeñas, en especial cuando la aplicación 
está optimizada para uso en pantallas de escritorio.

### Características técnicas:
- Detección automática del tipo de dispositivo a través del agente de usuario.
- Diseño visual con utilidades de \`Tailwind CSS\`.
- Traducción de mensajes mediante el hook \`useTranslation\` de \`react-i18next\`.
- No requiere configuración adicional ni props externas.

Este componente puede ser útil en vistas críticas que no garantizan una experiencia completa en dispositivos móviles.
        `}}}},e={name:"Vista por defecto",parameters:{docs:{description:{story:"Ejemplo por defecto del componente de advertencia para dispositivos móviles. Visible únicamente si se simula un agente móvil."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Ejemplo por defecto del componente de advertencia para dispositivos móviles. Visible únicamente si se simula un agente móvil."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const u=["Default"];export{e as Default,u as __namedExportsOrder,m as default};
