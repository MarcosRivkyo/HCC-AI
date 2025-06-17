import{r as d,u as p,a as f,j as c}from"./iframe-CtcKxV_0.js";import{A as g}from"./AuthDAO-Dq-0zJDM.js";import{U as h}from"./UserDAO-BKkpcXPq.js";import"./firebase-C7NIwWUw.js";function b(){const[r,o]=d.useState(!0),[l,u]=d.useState(null),e=p(),t=f();return d.useEffect(()=>{const m=g.subscribeToAuthChanges(async s=>{const n=["/","/login","/signup"].includes(t.pathname);if(!s||!s.emailVerified){n||e("/login"),u(null),o(!1);return}u(s);try{const a=await h.getUserRole(s.uid);if(!a){console.warn("No se encontró el rol del usuario"),e("/login"),o(!1);return}n&&e(a==="Paciente"?"/dashboard-patient":a==="Médico"||a==="Administrador"?"/dashboard":"/login"),n||(a==="Paciente"&&!(t.pathname==="/dashboard-patient"||t.pathname.startsWith("/estudio/"))&&e("/dashboard-patient"),(a==="Médico"||a==="Administrador")&&t.pathname==="/dashboard-patient"&&e("/dashboard"))}catch(a){console.error("Error al validar rol:",a),e("/login")}finally{o(!1)}});return()=>m()},[t.pathname,e]),{loading:r,user:l}}const A=()=>{const{loading:r,user:o}=b();return r?c.jsx("p",{children:"Cargando estado de autenticación..."}):o?c.jsxs("p",{children:["Usuario autenticado: ",o.email]}):c.jsx("p",{children:"Usuario no autenticado. Redirigiendo a Login..."})},x={title:"ViewModels/useAuthRouteViewModel",component:A,tags:["autodocs"],parameters:{docs:{description:{component:`
Viewmodel \`useAuthRouteViewModel\` encargado de controlar el acceso a rutas según el estado de autenticación y rol del usuario.

### Funcionalidad:
- Escucha cambios de autenticación con \`AuthDAO\`.
- Verifica si el usuario está verificado y autenticado.
- Consulta el rol del usuario mediante \`UserDAO\`.
- Redirige a páginas públicas o privadas según estado y rol.
- Muestra estados de carga y controla navegación con \`react-router-dom\`.

### Uso:
Se recomienda emplear este viewmodel en componentes de enrutamiento o layout para proteger rutas sensibles en la aplicación. Es por ello que se utilzia en el Router, cada vez que se intenta acceder a secciones o rutas privadas.

---


        `}}}},i={name:"Demo de control de rutas autenticadas"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Demo de control de rutas autenticadas"
}`,...i.parameters?.docs?.source}}};const y=["Default"];export{i as Default,y as __namedExportsOrder,x as default};
