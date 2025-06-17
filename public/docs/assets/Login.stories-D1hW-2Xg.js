import{u as E,r as t,j as e,L as S}from"./iframe-CtcKxV_0.js";import{A as y}from"./AuthDAO-Dq-0zJDM.js";import{p as I,q as P}from"./index-DNyRBZ_W.js";import{I as R}from"./ImageSlider-Ch-T7ImJ.js";import{u as _}from"./usePreventZoom-N8gjitD7.js";import{l as k}from"./logo_hcc_ai-BiJIWNNr.js";import{u as L}from"./useTranslation-BpOnEeka.js";import"./firebase-C7NIwWUw.js";function z(){const p=E(),[x,c]=t.useState(!1),[l,d]=t.useState(""),[n,f]=t.useState(""),[i,h]=t.useState(""),[g,s]=t.useState(""),[u,b]=t.useState(""),[w,v]=t.useState(!1),[a,o]=t.useState(!1),[C,j]=t.useState(!1);return{authing:x,email:l,password:i,resetEmail:n,error:g,successMessage:u,showResetInput:w,showPassword:a,transitioning:C,setEmail:d,setPassword:h,setResetEmail:f,setShowResetInput:v,setShowPassword:o,setTransitioning:j,signInWithEmail:async()=>{c(!0),s("");try{if((await y.login(l,i)).user.emailVerified){p("/dashboard"),j(!0);try{await Promise.all([fetch("https://hcc-ai-backend-1084523848624.europe-west2.run.app/",{method:"GET"}),fetch("https://ai-models-backend-1084523848624.europe-west2.run.app//",{method:"GET"})])}catch{}}else await y.logout(),s("Debes verificar tu correo antes de acceder.")}catch(r){r.code==="auth/invalid-credential"?s("Los datos introducidos no fueron correctos."):r.code==="auth/invalid-email"?s("El correo electrónico introducido no es válido."):r.code==="auth/missing-password"?s("Debe ingresar su contraseña para iniciar sesión."):s(r.message)}finally{c(!1)}},handlePasswordReset:async()=>{if(!n){s("Por favor, introduce tu email para restablecer la contraseña.");return}try{await y.sendResetEmail(n),b("Se ha enviado un correo para restablecer tu contraseña.")}catch(r){r.code==="auth/user-not-found"?s("No hay una cuenta registrada con ese correo."):s(r.message)}}}}const N=()=>{const{authing:p,email:x,password:c,resetEmail:l,error:d,successMessage:n,showResetInput:f,showPassword:i,setEmail:h,setPassword:g,setResetEmail:s,setShowResetInput:u,setShowPassword:b,signInWithEmail:w,handlePasswordReset:v}=z();_(!0,!0);const{t:a}=L("global");return e.jsxs("div",{className:"w-full h-screen flex",children:[e.jsx("div",{className:"w-1/2 h-full flex flex-col bg-[#282c34]",children:e.jsx(R,{})}),e.jsx("div",{className:"w-1/2 h-full bg-black flex flex-col p-20 justify-center",children:e.jsxs("div",{className:"w-full flex flex-col max-w-[450px] mx-auto",children:[e.jsxs("div",{className:"w-full flex flex-col mb-10 text-white",children:[e.jsx("img",{src:k,alt:"Logo HCC-AI",className:"w-80 rounded-md center mx-auto mb-10 cursor-pointer",onClick:()=>window.location.href="/"}),e.jsx("h3",{className:"text-4xl font-bold mb-2 text-center",children:a("login.login_text")}),e.jsx("p",{className:"text-lg mb-4 text-center",children:a("login.welcome_text")})]}),e.jsxs("div",{className:"w-full flex flex-col mb-6",children:[e.jsx("input",{type:"email",placeholder:a("login.email_placeholder"),className:"w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white",value:x,onChange:o=>h(o.target.value)}),e.jsxs("div",{className:"relative mb-4",children:[e.jsx("input",{type:i?"text":"password",placeholder:a("login.passwd_placeholder"),className:"w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white pr-10",value:c,onChange:o=>g(o.target.value)}),e.jsx("button",{type:"button",className:"absolute right-2 top-2 text-white",onClick:()=>b(!i),children:i?e.jsx(I,{}):e.jsx(P,{})})]})]}),e.jsx("div",{className:"w-full flex flex-col mb-4",children:e.jsx("button",{className:"w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer",onClick:w,disabled:p,children:a("login.login_text")})}),d&&e.jsx("div",{className:"text-red-500 mb-4 text-center",children:d}),n&&e.jsx("div",{className:"text-green-500 mb-4 text-center",children:n}),f?e.jsxs("div",{className:"w-full flex flex-col mb-6",children:[e.jsx("input",{type:"email",placeholder:"Introduce tu correo para restablecer la contraseña",className:"w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white",value:l,onChange:o=>s(o.target.value)}),e.jsx("div",{className:"w-full flex flex-col mb-4",children:e.jsx("button",{onClick:v,className:"w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer",children:a("login.error_send_email")})}),e.jsx("div",{className:"text-center mt-2",children:e.jsx("button",{onClick:()=>u(!1),className:"text-gray-400 text-sm underline",children:a("login.error_remake")})})]}):e.jsx("div",{className:"text-center",children:e.jsx("button",{onClick:()=>u(!0),className:"text-gray-400 text-sm underline",children:a("login.forgot_passwd")})}),e.jsxs("div",{className:"w-full flex items-center justify-center relative py-4",children:[e.jsx("div",{className:"w-full h-[1px] bg-gray-500"}),e.jsx("p",{className:"text-lg absolute text-gray-500 bg-black px-2",children:"OR"})]}),e.jsx("div",{className:"w-full flex items-center justify-center mt-10",children:e.jsxs("p",{className:"text-sm font-normal text-gray-400",children:[a("login.no_account"),e.jsx("span",{className:"font-semibold text-white cursor-pointer underline",children:e.jsxs(S,{to:"/signup",children:[" ",a("login.register")]})})]})})]})})]})};N.__docgenInfo={description:"",methods:[],displayName:"Login"};const Z={title:"Views/Login",component:N,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
# Componente: Login

El componente **Login** define la interfaz principal de autenticación para los usuarios de la plataforma **HCC-AI**. Permite el acceso seguro al sistema mediante correo electrónico y contraseña, e integra funcionalidades adicionales para la experiencia del usuario.

---

## Funcionalidades principales:

- Campos de entrada para credenciales:
  - Dirección de correo electrónico
  - Contraseña (con opción para mostrar u ocultar)
- Botón de envío de formulario con validación básica
- Botñon para la recuperación de contraseña
- Componente visual \`ImageSlider\` como elemento decorativo
- Prevención del zoom no deseado mediante combinaciones de teclado y scroll
- Feedback visual de carga y errores
- Traducción dinámica con \`react-i18next\`

---

## Lógica encapsulada:

Se gestiona mediante el hook personalizado \`useLoginViewModel\`, que abstrae la lógica de negocio y controla:

- Validación de campos
- Gestión del estado de carga y errores
- Comunicación con servicios de autenticación
- Eventos de cambio en los inputs

---

## Dependencias utilizadas:

- \`react-router-dom\` para redireccionamientos tras inicio de sesión
- \`react-i18next\` para internacionalización
- \`tailwindcss\` para diseño responsivo
- \`ImageSlider\` para elementos gráficos dinámicos
- \`usePreventZoom\` para bloquear combinaciones Ctrl + scroll / Ctrl + +/- 

---

## Observaciones:

Este componente debe ser renderizado dentro de un proveedor de rutas (\`<MemoryRouter>\` o similar) y con contexto de traducción activo para su correcto funcionamiento.

        `}}}},m={name:"Vista por defecto",parameters:{docs:{description:{story:"Renderiza el formulario de autenticación con campos para correo y contraseña, control de visibilidad y enlace a recuperación."}}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Renderiza el formulario de autenticación con campos para correo y contraseña, control de visibilidad y enlace a recuperación."
      }
    }
  }
}`,...m.parameters?.docs?.source}}};const J=["Default"];export{m as Default,J as __namedExportsOrder,Z as default};
