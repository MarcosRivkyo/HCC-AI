import{j as e}from"./iframe-Ce_CfLMD.js";import{o as s,p as r,q as n}from"./index-BZiZ2ILP.js";import{l as i}from"./logo_hcc_ai-BiJIWNNr.js";import{u as c}from"./useTranslation-_9OesG3Q.js";const l=""+new URL("logo_usal-DrILsNu8.png",import.meta.url).href,d=""+new URL("logoHP-DWRPZ6R-.png",import.meta.url).href,t=()=>{const[a]=c("global");return e.jsxs("footer",{className:"bg-black text-white py-8 mt-20",children:[e.jsxs("div",{className:"container mx-auto flex flex-col md:flex-row justify-between items-center px-6",children:[e.jsxs("div",{className:"mb-6 md:mb-0 text-center md:text-left",children:[e.jsx("img",{src:i,alt:"Logo HCC-AI",className:"w-32 mx-auto md:mx-0"}),e.jsx("p",{className:"mt-2 text-sm text-gray-400",children:a("footer.description")})]}),e.jsxs("div",{className:"flex space-x-6 text-sm",children:[e.jsx("a",{href:"https://www.usal.es",target:"_blank",rel:"noopener noreferrer",children:e.jsx("img",{src:l,alt:"Logo USAL",className:"w-64 mx-auto md:mx-0"})}),e.jsx("a",{href:"https://hpscds.com/",target:"_blank",rel:"noopener noreferrer",children:e.jsx("img",{src:d,alt:"Logo HP",className:"w-64 mx-auto md:mx-0"})})]}),e.jsxs("div",{className:"flex space-x-4 mt-6 md:mt-0",children:[e.jsx("a",{href:"mailto:marcos.rivkyo@gmail.com",className:"text-gray-400 hover:text-white",title:"Correo: marcos.rivkyo@usal.es",children:e.jsx(s,{size:20})}),e.jsx("a",{href:"https://www.linkedin.com/in/marcos-rivas-kyoguro-7ab518248",target:"_blank",rel:"noopener noreferrer",className:"text-gray-400 hover:text-white",title:"LinkedIn",children:e.jsx(r,{size:20})}),e.jsx("a",{href:"https://github.com/MarcosRivkyo",target:"_blank",rel:"noopener noreferrer",className:"text-gray-400 hover:text-white",title:"GitHub",children:e.jsx(n,{size:20})})]})]}),e.jsxs("div",{className:"text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4",children:["© ",new Date().getFullYear()," ",a("footer.copyright")]})]})};t.__docgenInfo={description:"",methods:[],displayName:"Footer"};const g={title:"Components/Footer",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
# Componente: Footer

El componente **Footer** es el pie de página de la aplicación. Se utiliza para mostrar información institucional, enlaces a entidades colaboradoras y medios de contacto del proyecto.

---

## 🧩 Funcionalidad

- Muestra el logo de la plataforma principal \`HCC-AI\`.
- Enlaces a instituciones colaboradoras como:
  - **Universidad de Salamanca (USAL)**
  - **HP SCDS**
- Datos de contacto personal:
  - Correo electrónico
  - LinkedIn
  - GitHub

---

## 🌍 Internacionalización

Usa el hook \`useTranslation("global")\` de **react-i18next** para renderizar el texto traducido de la descripción y el copyright.

---

## 🎨 Estilos y diseño

- Totalmente responsivo: ajusta su layout en pantallas pequeñas.
- Usa utilidades de \`Tailwind CSS\` para espaciado, tipografía y color.
- Logos y enlaces están alineados con el diseño de la marca.

---

## 📦 Dependencias

- \`react-icons\` para mostrar iconos de redes sociales.
- \`react-i18next\` para traducciones.
- Imágenes locales de logos: \`logoHCC_AI.jpg\`, \`logo_usal.png\`, \`logoHP.png\`.

---

## 🧪 Consideraciones técnicas

| Elemento     | Propósito                                      |
|--------------|-----------------------------------------------|
| \`FaEnvelope\` | Icono de correo electrónico (contacto directo) |
| \`FaLinkedin\` | Enlace profesional del autor (LinkedIn)       |
| \`FaGithub\`   | Código fuente en GitHub                      |

---

## ℹ️ Observación

Este componente no requiere props ni maneja estado local. Puede ser incluido en cualquier layout de página y se ajusta automáticamente al contenido.
        `}}}},o={parameters:{docs:{description:{story:"Renderiza el pie de página estándar con enlaces institucionales, información de contacto y traducciones dinámicas."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Renderiza el pie de página estándar con enlaces institucionales, información de contacto y traducciones dinámicas."
      }
    }
  }
}`,...o.parameters?.docs?.source}}};const h=["Default"];export{o as Default,h as __namedExportsOrder,g as default};
