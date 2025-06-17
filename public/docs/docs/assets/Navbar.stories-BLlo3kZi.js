import{r as i,u as I,j as e}from"./iframe-Ce_CfLMD.js";import{A}from"./AuthDAO-DmWoopg-.js";import{U as D}from"./UserDAO-VV-yXTrd.js";import{h as z,i as j,j as E,k as T,l as L}from"./index-BZiZ2ILP.js";import{L as k}from"./Logout-Dx3F7Kfs.js";import{l as R}from"./logo_hcc_ai-BiJIWNNr.js";import{l as B}from"./logo_user-DOgDUfrm.js";import{u as U}from"./useTranslation-_9OesG3Q.js";import"./firebase-BFVMFqfP.js";const P=()=>{const[o,d]=i.useState(null),[g,m]=i.useState(null),[u,p]=i.useState("home"),[x,b]=i.useState(!1),[l,f]=i.useState(!1),a=i.useRef(null),w=I();i.useEffect(()=>{const s=A.subscribeToAuthChanges(async n=>{if(d(n),n)try{const r=await D.getUserById(n.uid);m(r)}catch(r){console.error("Error al obtener datos del usuario:",r)}});return()=>s()},[]),i.useEffect(()=>{const s=n=>{a.current&&!a.current.contains(n.target)&&b(!1)};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[]),i.useEffect(()=>{const s=new IntersectionObserver(r=>{r.forEach(c=>{c.isIntersecting&&p(c.target.id)})},{root:null,rootMargin:"0px",threshold:.6});return["home","objectives","services","technology"].forEach(r=>{const c=document.getElementById(r);c&&s.observe(c)}),()=>s.disconnect()},[]);function t(s){return s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2}return{user:o,userData:g,selectedSection:u,isOpen:x,setIsOpen:b,mobileMenuOpen:l,setMobileMenuOpen:f,dropdownRef:a,navigate:w,scrollToSection:s=>{p(s);const n=document.getElementById(s);if(!n)return;const r=n.getBoundingClientRect().top+window.pageYOffset,c=window.scrollY,M=r-c,N=1e3;let v=null;const y=C=>{v||(v=C);const F=C-v,S=t(Math.min(F/N,1));window.scrollTo(0,c+M*S),F<N&&window.requestAnimationFrame(y)};window.requestAnimationFrame(y)}}},O=()=>{const{user:o,userData:d,selectedSection:g,isOpen:m,setIsOpen:u,mobileMenuOpen:p,setMobileMenuOpen:x,dropdownRef:b,navigate:l,scrollToSection:f}=P(),[a,w]=U("global");return e.jsxs(e.Fragment,{children:[e.jsxs("nav",{className:"bg-black p-6 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg",children:[e.jsx("ul",{className:"hidden md:flex space-x-4 text-sm",children:[{id:"home",label:a("navbar.home")},{id:"objectives",label:a("navbar.objective")},{id:"services",label:a("navbar.services")},{id:"technology",label:a("navbar.technologies")}].map(t=>e.jsx("li",{children:e.jsx("button",{onClick:()=>f(t.id),className:`ml-20 transition-all duration-200 ${g===t.id?"text-red-400 font-bold":"hover:text-gray-300"}`,children:t.label})},t.id))}),e.jsx("div",{className:"absolute left-1/2 transform -translate-x-1/2",children:e.jsx("img",{src:R,className:"w-32 rounded-md cursor-pointer",alt:"HCC-AI Logo",onClick:()=>f("home")})}),e.jsx("div",{className:"hidden md:flex ml-auto space-x-8",children:o&&o.emailVerified?e.jsxs("div",{ref:b,className:"relative inline-block",children:[e.jsxs("div",{className:`inline-flex items-center gap-3 px-4 py-2 cursor-pointer bg-gray-900 hover:bg-gray-700 rounded-xl transition duration-300 shadow-md ${m?"ring-2 ring-pink-500":""}`,onClick:()=>u(!m),children:[e.jsx("img",{src:d?.profilePicture||o?.photoURL||B,alt:"Perfil",className:"w-10 h-10 rounded-full border border-white"}),e.jsx("span",{className:"font-semibold whitespace-nowrap",children:o?.displayName||(d?.firstName||d?.lastName?`${d.firstName} ${d.lastName}`:o?.email||"Usuario")}),e.jsx(z,{className:`text-sm transition-transform ${m?"rotate-180":""}`})]}),m&&e.jsxs("div",{className:"absolute top-full left-0 w-full bg-gray-900 rounded-xl shadow-xl mt-2 border border-gray-700 transition-all duration-300 ease-out animate-fade-in",children:[e.jsxs("button",{onClick:async()=>{l("/dashboard");try{await Promise.all([fetch("https://hcc-ai-backend-1084523848624.europe-west2.run.app/",{method:"GET"}),fetch("https://ai-models-backend-1084523848624.europe-west2.run.app//",{method:"GET"})])}catch{}},className:"flex items-center px-4 py-3 w-full text-left hover:bg-gray-800 transition duration-200",children:[e.jsx(j,{className:"mr-2"}),a("navbar.access")]}),e.jsx(k,{})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative inline-flex group",children:[e.jsx("div",{className:"absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:-duration-200 animate-tilt"}),e.jsxs("a",{href:"#",onClick:()=>l("/login"),className:"relative inline-flex items-center justify-center px-6 py-2 text-md font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",children:[e.jsx(j,{className:"mr-2"}),a("navbar.login")]})]}),e.jsxs("div",{className:"relative inline-flex group",children:[e.jsx("div",{className:"absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:-duration-200 animate-tilt"}),e.jsxs("a",{href:"#",onClick:()=>l("/signup"),className:"relative inline-flex items-center justify-center px-6 py-2 text-md font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",children:[e.jsx(E,{className:"mr-2"}),a("navbar.register")]})]})]})}),e.jsx("div",{className:"md:hidden z-50",children:e.jsx("button",{onClick:()=>x(!p),children:p?e.jsx(T,{size:24}):e.jsx(L,{size:24})})})]}),p&&e.jsxs("div",{className:"md:hidden mt-4 space-y-4 bg-gray-900 p-4 rounded-lg shadow-lg",children:[[{id:"home",label:a("navbar.home")},{id:"objectives",label:a("navbar.objective")},{id:"services",label:a("navbar.services")},{id:"technology",label:a("navbar.technologies")}].map(t=>e.jsx("div",{children:e.jsx("button",{onClick:()=>{f(t.id),u(!1)},className:`block w-full text-left text-sm ${g===t.id?"text-red-400 font-bold":"text-white"}`,children:t.label})},t.id)),e.jsx("div",{className:"border-t border-gray-700 pt-4",children:o&&o.emailVerified?e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>{l("/dashboard"),u(!1)},className:"w-full text-left py-2",children:a("navbar.access")}),e.jsx(k,{})]}):e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>{l("/login"),u(!1)},className:"w-full text-left py-2",children:[e.jsx(j,{className:"inline mr-2"}),a("navbar.login")]}),e.jsxs("button",{onClick:()=>{l("/signup"),u(!1)},className:"w-full text-left py-2",children:[e.jsx(E,{className:"inline mr-2"}),a("navbar.register")]})]})})]})]})};O.__docgenInfo={description:"",methods:[],displayName:"Navbar"};const W={title:"Components/Navbar",component:O,tags:["autodocs"],parameters:{docs:{description:{component:`

El componente **Navbar** representa la barra de navegación fija de la aplicación. Sirve como acceso principal a secciones del sitio y muestra diferentes opciones según el estado de autenticación del usuario.

---

## Características principales:

- Internacionalización con \`react-i18next\`
- Control de usuario autenticado con lógica condicional
- Diseño responsivo con menú hamburguesa en móvil
- Control centralizado del estado con \`useAppNavbarViewModel\`
- Navegación a secciones por scroll
- Acceso a Dashboard para usuarios logueados
- Logout con el componente \`<Logout />\`

---

## Dependencias:

- \`react-router-dom\` para navegación mediante \`navigate()\`
- \`react-i18next\` para traducción de textos con \`t("...")\`
- \`react-icons\` para íconos visuales (login, logout, etc.)
- \`tailwindcss\` para estilos utilitarios

---

## ViewModel (useAppNavbarViewModel)

Este hook personalizado centraliza toda la lógica del componente, incluyendo:

- Estado del menú (\`isOpen\`, \`mobileMenuOpen\`)
- Usuario y datos de perfil (\`user\`, \`userData\`)
- Funciones de navegación y scroll (\`scrollToSection\`, \`navigate\`)
      `}}}},h={parameters:{docs:{description:{story:"Renderiza la barra de navegación con vista por defecto. Muestra los botones de autenticación cuando el usuario no ha iniciado sesión."}}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Renderiza la barra de navegación con vista por defecto. Muestra los botones de autenticación cuando el usuario no ha iniciado sesión."
      }
    }
  }
}`,...h.parameters?.docs?.source}}};const X=["Default"];export{h as Default,X as __namedExportsOrder,W as default};
