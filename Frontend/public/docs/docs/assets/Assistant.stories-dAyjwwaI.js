import{A as a}from"./AssistantView-XCM7gW83.js";import"./iframe-Ce_CfLMD.js";import"./useTranslation-_9OesG3Q.js";const n={title:"Views/Assistant",component:a,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
## 🧠 Assistant – Asistente de IA

El componente **Assistant** proporciona una interfaz de chat estilo chatbot integrada con un modelo de lenguaje. Es una utilidad que forma parte del módulo de ayuda asistida en la plataforma **HCC-AI**.

---

### 🔍 Características:

- Soporte para múltiples mensajes entre usuario y asistente.
- Estilo visual tipo chat.
- Desplazamiento automático al último mensaje.
- Área de entrada expandible.
- Indicador de carga animado durante la espera de respuesta.
- Traducción con \`react-i18next\`.
- Lógica desacoplada mediante el hook personalizado \`useAssistantViewModel\`.

### 📦 Dependencias internas

- **Estado de vista:** pregunta, historial, carga.
- **Acciones:** envío de pregunta, actualización del campo.
- **Referencias DOM:** para hacer scroll automático.

> ⚠️ Requiere conexión funcional con el ViewModel \`useAssistantViewModel\`, que gestiona las respuestas AI.
        `}}}},e={name:"Vista por defecto",parameters:{docs:{description:{story:"Render del componente de asistente AI en su vista completa. Incluye ejemplo visual del área de conversación."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Render del componente de asistente AI en su vista completa. Incluye ejemplo visual del área de conversación."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const r=["Default"];export{e as Default,r as __namedExportsOrder,n as default};
