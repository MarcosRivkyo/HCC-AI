import{j as e}from"./iframe-CtcKxV_0.js";import{u as c}from"./useAssistantViewModel-DeTdncya.js";const u=()=>{const{question:o,setQuestion:r,chatHistory:n,isLoading:a,sendQuestion:i,chatEndRef:d}=c();return e.jsxs("div",{style:{maxWidth:600,margin:"auto",padding:20,fontFamily:"Arial, sans-serif"},children:[e.jsx("h2",{children:"useAssistantViewModel Demo"}),e.jsxs("div",{style:{border:"1px solid #ccc",borderRadius:8,height:300,overflowY:"auto",padding:10,marginBottom:10,backgroundColor:"#f9f9f9"},children:[n.map((t,l)=>e.jsx("div",{style:{marginBottom:8,textAlign:t.type==="user"?"right":"left"},dangerouslySetInnerHTML:{__html:t.content}},l)),e.jsx("div",{ref:d})]}),e.jsx("textarea",{placeholder:"Escribe tu pregunta aquí...",value:o,onChange:t=>r(t.target.value),rows:3,style:{width:"100%",padding:8,marginBottom:8,fontSize:14,borderRadius:4,borderColor:"#ccc"},disabled:a}),e.jsx("button",{onClick:i,disabled:a||!o.trim(),style:{padding:"10px 20px",backgroundColor:a||!o.trim()?"#ccc":"#007bff",color:"#fff",border:"none",borderRadius:4,cursor:a||!o.trim()?"default":"pointer"},children:a?"Cargando...":"Enviar"})]})},g={title:"ViewModels/useAssistantViewModel",component:u,tags:["autodocs"],parameters:{docs:{description:{component:`
Viewmodel \`useAssistantViewModel\` que gestiona la lógica del asistente virtual integrado en la plataforma **HCC-AI**.

### Funcionalidad principal:
- Gestiona la pregunta actual del usuario.
- Mantiene el historial de mensajes entre usuario y asistente.
- Envía la pregunta al backend con IA y procesa la respuesta en formato Markdown.
- Controla el estado de carga mientras espera respuesta.
- Realiza scroll automático al último mensaje.

### Notas técnicas:
- La respuesta se procesa con \`marked\` para renderizar Markdown como HTML.
- El viewmodel usa \`fetch\` para comunicación con el backend "HCC_AI_BACKEND" configurado en \`VITE_BACKEND_URL\`.
- Maneja errores de conexión mostrando mensajes adecuados.

### Uso:
Ideal para integrar en interfaces tipo chat o asistentes conversacionales dentro del sistema clínico.

        `}}}},s={name:"Demo del ViewModel"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Demo del ViewModel"
}`,...s.parameters?.docs?.source}}};const f=["Default"];export{s as Default,f as __namedExportsOrder,g as default};
