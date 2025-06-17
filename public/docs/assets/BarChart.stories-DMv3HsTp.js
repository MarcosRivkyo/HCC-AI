import{B as r}from"./BarChart-ClSLvyaE.js";import"./iframe-CtcKxV_0.js";const t={title:"Components/BarChart",component:r,tags:["autodocs"],argTypes:{theme:{control:"radio",options:["light","dark"]}},parameters:{docs:{description:{component:`
**BarChart** es un componente de visualización gráfica que utiliza \`react-chartjs-2\` para representar visualmente un conjunto de probabilidades en un gráfico de barras.

Este componente es especialmente útil para mostrar salidas de clasificación de modelos de IA y admite personalización según el tema visual (claro u oscuro).

### Props:
- \`probabilities: number[]\` — Array con las probabilidades que se desean representar.
- \`labels: string[]\` — Etiquetas para cada barra del gráfico.
- \`theme: "light" | "dark"\` — Determina el esquema de colores según el tema activo.

### Dependencias:
- \`chart.js\`
- \`react-chartjs-2\`

### Funcionalidad:
- Visualización clara de distribuciones probabilísticas.
- Adaptación automática de estilo según tema.
- Altamente reutilizable en vistas y paneles de resultados.
        `}}}},e={args:{probabilities:[.12,.45,.76,.22],labels:["Clase A","Clase B","Clase C","Clase D"],theme:"light"},parameters:{docs:{description:{story:"Ejemplo por defecto del gráfico de barras en modo claro. Muestra la distribución de probabilidades entre cuatro clases."}}}},a={name:"Vista por defecto",args:{probabilities:[.9,.1,.3],labels:["Positivo","Negativo","Incierto"],theme:"dark"},parameters:{docs:{description:{story:"Gráfico de barras adaptado al tema oscuro. Ideal para interfaces con diseño nocturno o de bajo contraste."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    probabilities: [0.12, 0.45, 0.76, 0.22],
    labels: ["Clase A", "Clase B", "Clase C", "Clase D"],
    theme: "light"
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo por defecto del gráfico de barras en modo claro. Muestra la distribución de probabilidades entre cuatro clases."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  args: {
    probabilities: [0.9, 0.1, 0.3],
    labels: ["Positivo", "Negativo", "Incierto"],
    theme: "dark"
  },
  parameters: {
    docs: {
      description: {
        story: "Gráfico de barras adaptado al tema oscuro. Ideal para interfaces con diseño nocturno o de bajo contraste."
      }
    }
  }
}`,...a.parameters?.docs?.source}}};const i=["Default","DarkTheme"];export{a as DarkTheme,e as Default,i as __namedExportsOrder,t as default};
