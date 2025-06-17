import{j as e}from"./iframe-Ce_CfLMD.js";import{u as r}from"./usePreventZoom-BSglsWei.js";const s=()=>(r(!0,!0),e.jsxs("div",{className:"p-6 text-center",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"Demo: usePreventZoom"}),e.jsxs("p",{children:["Prueba hacer ",e.jsx("strong",{children:"Ctrl + Scroll"})," o"," ",e.jsx("strong",{children:"Ctrl + + / -"})," y verás que el navegador no hace zoom."]}),e.jsx("p",{className:"mt-4 text-gray-500",children:"Este hook es útil en aplicaciones con layouts fijos o editores gráficos."})]})),n={title:"components/usePreventZoom",component:s,tags:["autodocs"],parameters:{docs:{description:{component:`
El hook \`usePreventZoom\` previene que los usuarios hagan zoom en el navegador por accidente usando:

- \`Ctrl + Scroll\` (rueda del ratón)
- \`Ctrl + + / -\` (teclado)

### Uso básico:

\`\`\`tsx
usePreventZoom(); // Previene zoom por scroll y teclado
usePreventZoom(true, false); // Solo scroll
usePreventZoom(false, true); // Solo teclado
\`\`\`

Ideal para herramientas como dashboards, editores, visores médicos, etc.
        `}}}},o={name:"Bloqueo total de zoom"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Bloqueo total de zoom"
}`,...o.parameters?.docs?.source}}};const l=["Default"];export{o as Default,l as __namedExportsOrder,n as default};
