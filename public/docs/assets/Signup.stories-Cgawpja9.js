import{r as t,j as e,L as T}from"./iframe-CtcKxV_0.js";import{p as R,q as L}from"./index-DNyRBZ_W.js";import{A as I}from"./AuthDAO-Dq-0zJDM.js";import{U as W}from"./UserDAO-BKkpcXPq.js";import{l as $}from"./logo_hcc_ai-BiJIWNNr.js";import{I as Z}from"./ImageSlider-Ch-T7ImJ.js";import{u as B}from"./usePreventZoom-N8gjitD7.js";import{u as G}from"./useTranslation-BpOnEeka.js";import"./firebase-C7NIwWUw.js";function J(){const[S,r]=t.useState(!1),[m,d]=t.useState(""),[u,f]=t.useState(""),[g,h]=t.useState(""),[b,x]=t.useState(""),[i,p]=t.useState(""),[n,l]=t.useState(""),[w,v]=t.useState(""),[y,j]=t.useState(""),[P,o]=t.useState(""),[A,C]=t.useState(""),[E,k]=t.useState(!1),[_,F]=t.useState(!1),[a,s]=t.useState("Paciente"),U="https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Fdefault_logo_user.png?alt=media&token=499a8fd4-85dc-49be-8d4a-a469aea1d1f7",V=[{name:"EASL",url:"https://easl.eu/",icon:"https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Flogo_easl.png?alt=media&token=9efaaa87-e6be-44ef-8911-e62a5104db44"},{name:"HRHortega",url:"https://www.saludcastillayleon.es/HRHortega/es",icon:"https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Flogo_rhortega.png?alt=media&token=8c388557-614a-4c8f-9419-3eed2157a513"},{name:"HP SCDS",url:"https://hpscds.com/",icon:"https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Flogo_hp.jpg?alt=media&token=90a2bd62-565e-4661-993c-36c822d10e1a"}];return{authing:S,email:m,password:u,confirmPassword:g,rol:a,accessCode:b,userName:i,firstName:n,lastName:w,phone:y,error:P,verificationMessage:A,showPassword:E,showConfirmPassword:_,setEmail:d,setPassword:f,setRol:s,setConfirmPassword:h,setAccessCode:x,setUserName:p,setFirstName:l,setLastName:v,setPhone:j,setShowPassword:k,setShowConfirmPassword:F,signUpWithEmail:async()=>{const z=/^[a-z0-9_]+$/,D=/(select|insert|delete|update|drop|--|'|"|;)/i,O="HCC_AI_2025_33";if(r(!0),o(""),C(""),!O.includes(b.trim())){o("El código de acceso es inválido."),r(!1);return}if(u!==g){o("Las contraseñas no coinciden"),r(!1);return}if(!z.test(i)){o("El nombre de usuario solo puede contener letras minúsculas, números y guiones bajos."),r(!1);return}if(D.test(i)){o("El nombre de usuario contiene caracteres o palabras no permitidas."),r(!1);return}try{const c=(await I.registerUser(m,u)).user;await I.updateUserProfile(c,i,U),await I.sendVerificationEmail(c);const q={userName:i,firstName:n,lastName:w,email:c.email,phone:y,rol:a,profilePicture:U,imageFolder:`HCC-AI/users/${c.uid}/images/`,documentFolder:`HCC-AI/users/${c.uid}/documents/`,useful_links:V};await W.createUser(c.uid,q),p(""),l(""),v(""),d(""),j(""),s("Paciente"),f(""),h(""),x(""),C("Registro exitoso. Por favor, verifica tu correo electrónico antes de iniciar sesión.")}catch(H){H.code==="auth/email-already-in-use"?o("Esta dirección de correo ya está registrada."):H.code==="auth/weak-password"?o("La contraseña debe tener al menos 6 caracteres."):o("Hubo un error en el registro. Inténtalo de nuevo.")}r(!1)}}}function M(){const{authing:S,email:r,password:m,rol:d,confirmPassword:u,accessCode:f,userName:g,firstName:h,lastName:b,phone:x,error:i,verificationMessage:p,showPassword:n,showConfirmPassword:l,setEmail:w,setPassword:v,setRol:y,setConfirmPassword:j,setAccessCode:P,setUserName:o,setFirstName:A,setLastName:C,setPhone:E,setShowPassword:k,setShowConfirmPassword:_,signUpWithEmail:F}=J();B(!0,!0);const{t:a}=G("global");return e.jsxs("div",{className:"w-full h-screen flex",children:[e.jsx("div",{className:"w-1/2 h-full flex flex-col bg-[#282c34]",children:e.jsx(Z,{})}),e.jsxs("div",{className:"w-1/2 h-full bg-black flex flex-col p-20 justify-center",children:[e.jsxs("div",{className:"w-full flex flex-col max-w-[450px] mx-auto",children:[e.jsxs("div",{className:"w-full flex flex-col mb-10 text-white",children:[e.jsx("img",{src:$,alt:"Logo HCC-AI",className:"w-80 rounded-md center mx-auto mb-10 cursor-pointer",onClick:()=>window.location.href="/"}),e.jsx("h3",{className:"text-4xl font-bold mb-2 text-center",children:a("signup.title")}),e.jsx("p",{className:"text-lg mb-4 text-center",children:a("signup.subtitle")})]}),e.jsx("input",{type:"text",placeholder:a("signup.username"),className:"flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white mb-4",value:g,onChange:s=>o(s.target.value)}),e.jsxs("div",{className:"w-full flex flex-wrap gap-4 mb-6",children:[e.jsx("input",{type:"text",placeholder:a("signup.firstname"),className:"flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white",value:h,onChange:s=>A(s.target.value)}),e.jsx("input",{type:"text",placeholder:a("signup.lastname"),className:"flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white",value:b,onChange:s=>C(s.target.value)})]}),e.jsx("input",{type:"email",placeholder:a("signup.email"),className:"w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white",value:r,onChange:s=>w(s.target.value)}),e.jsxs("div",{className:"w-full flex flex-wrap gap-4 mb-6",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx("input",{type:n?"text":"password",placeholder:a("signup.password"),className:"w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white pr-10",value:m,onChange:s=>v(s.target.value)}),e.jsx("button",{type:"button",className:"absolute right-0 top-2 text-white",onClick:()=>k(!n),children:n?e.jsx(R,{}):e.jsx(L,{})})]}),e.jsxs("div",{className:"relative flex-1",children:[e.jsx("input",{type:l?"text":"password",placeholder:a("signup.confirm_password"),className:"w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white pr-10",value:u,onChange:s=>j(s.target.value)}),e.jsx("button",{type:"button",className:"absolute right-0 top-2 text-white",onClick:()=>_(!l),children:l?e.jsx(R,{}):e.jsx(L,{})})]})]}),e.jsxs("div",{className:"w-full flex flex-wrap gap-4 mb-6",children:[e.jsxs("select",{className:"flex-1 text-white bg-black appearance-none py-2 border-b border-gray-500 focus:outline-none focus:border-white",value:d,onChange:s=>y(s.target.value),children:[e.jsx("option",{value:"Paciente",children:a("signup.role.patient")}),e.jsx("option",{value:"Médico",children:a("signup.role.doctor")}),e.jsx("option",{value:"Administrador",children:a("signup.role.admin")})]}),d!=="Paciente"&&e.jsx("input",{type:"text",placeholder:a("signup.access_code"),className:"flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white",value:f,onChange:s=>P(s.target.value)})]}),e.jsx("input",{type:"text",placeholder:a("signup.phone"),className:"w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white mb-6",value:x,onChange:s=>E(s.target.value)}),i&&e.jsx("div",{className:"text-red-500 mb-4",children:i}),p&&e.jsx("div",{className:"text-green-500 mb-4",children:p}),e.jsx("div",{className:"w-full flex flex-col mb-4",children:e.jsx("button",{onClick:F,disabled:S,className:"w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer",children:a("signup.button")})}),e.jsxs("div",{className:"w-full flex items-center justify-center relative py-4",children:[e.jsx("div",{className:"w-full h-[1px] bg-gray-500"}),e.jsx("p",{className:"text-lg absolute text-gray-500 bg-black px-2",children:"OR"})]})]}),e.jsx("div",{className:"w-full flex items-center justify-center mt-10",children:e.jsxs("p",{className:"text-sm font-normal text-gray-400",children:[a("signup.have_account")," ",e.jsx("span",{className:"font-semibold text-white cursor-pointer underline",children:e.jsx(T,{to:"/login",children:a("signup.login_link")})})]})})]})]})}M.__docgenInfo={description:"",methods:[],displayName:"Signup"};const ie={title:"Views/Signup",component:M,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`
# Vista: Signup – Registro de Usuario

El componente **Signup** representa el formulario de registro de nuevos usuarios en la plataforma **HCC-AI**.

---

## Funcionalidades principales

- Formulario estructurado con campos obligatorios:
  - Nombre
  - Apellidos
  - Correo electrónico
  - Contraseña y confirmación
  - Rol del usuario (Paciente, Médico, Administrador)
  - Código de acceso (para el rol Médico o Administrador)
  - Teléfono de contacto
- Alternancia de visibilidad de las contraseñas
- Validaciones locales e integración con Firebase Auth
- Componente visual de fondo mediante \`<ImageSlider />\`
- Traducción dinámica con \`react-i18next\`
- Prevención de zoom no deseado con el hook \`usePreventZoom\`

---

## Lógica desacoplada

Utiliza el custom hook \`useSignupViewModel\`, que encapsula:

- Estados de formulario
- Manejo de errores y notificaciones
- Envío de datos y creación de usuario
- Reglas de negocio por rol

---

## Dependencias

- \`react-router-dom\`: navegación post-registro
- \`firebase\`: creación de usuarios
- \`tailwindcss\`: estilos utilitarios responsivos
- \`react-toastify\`: alertas y confirmaciones visuales
- \`react-i18next\`: internacionalización

---

## Consideraciones

Este componente requiere conexión activa a Firebase y entorno autenticado para completar el registro. En modo Storybook, puede simularse con mocks.

        `}}}},N={name:"Vista por defecto",parameters:{docs:{description:{story:"Renderiza el formulario de registro completo, incluyendo campos obligatorios, validaciones y estilos personalizados."}}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Renderiza el formulario de registro completo, incluyendo campos obligatorios, validaciones y estilos personalizados."
      }
    }
  }
}`,...N.parameters?.docs?.source}}};const ne=["Default"];export{N as Default,ne as __namedExportsOrder,ie as default};
