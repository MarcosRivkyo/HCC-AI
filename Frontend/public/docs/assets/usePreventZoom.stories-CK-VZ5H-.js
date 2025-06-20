import{j as e}from"./iframe-CtcKxV_0.js";import{u as r}from"./usePreventZoom-N8gjitD7.js";const a=()=>(r(!0,!0),e.jsxs("div",{className:"p-6 text-center",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"Demo: usePreventZoom"}),e.jsxs("p",{children:["Prueba realizar ",e.jsx("strong",{children:"Ctrl + Scroll"})," o ",e.jsx("strong",{children:"Ctrl + + / -"}),". El navegador no responderá con zoom gracias a la acción del hook."]}),e.jsx("p",{className:"mt-4 text-gray-500",children:"Este comportamiento es útil en interfaces sensibles al escalado, como editores, dashboards o visores clínicos."})]})),n={title:"Components/usePreventZoom",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
El hook **usePreventZoom** desactiva la funcionalidad de zoom predeterminado del navegador, comúnmente activado por:

- Combinación de teclas: \`Ctrl + + / -\`
- Rueda del ratón: \`Ctrl + Scroll\`

### Sintaxis de uso:

\`\`\`tsx
usePreventZoom();           // Previene zoom por teclado y scroll
usePreventZoom(true, false); // Solo bloquea zoom con scroll
usePreventZoom(false, true); // Solo bloquea zoom con teclado
\`\`\`

### Aplicaciones recomendadas:
- Interfaces gráficas con resolución fija.
- Editores de imagen, vídeo o lienzos interactivos.
- Plataformas clínicas con estructuras visuales críticas.

Este hook puede utilizarse a nivel de componente o vista, y se recomienda aplicarlo con precaución para no interferir con accesibilidad si no es estrictamente necesario.
        `}}}},o={name:"Vista por defecto",parameters:{docs:{description:{story:"Ejemplo por defecto que previene el zoom por scroll y combinaciones de teclado al activar el hook con ambos flags en true."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Ejemplo por defecto que previene el zoom por scroll y combinaciones de teclado al activar el hook con ambos flags en true."
      }
    }
  }
}`,...o.parameters?.docs?.source}}};const c=["Default"];export{o as Default,c as __namedExportsOrder,n as default};
