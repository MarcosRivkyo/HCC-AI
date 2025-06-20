import{U as a}from"./UsefulLinks-BHq1qCOj.js";import"./iframe-Ce_CfLMD.js";import"./index-BZiZ2ILP.js";import"./UserDAO-VV-yXTrd.js";import"./firebase-BFVMFqfP.js";import"./useTranslation-_9OesG3Q.js";const c={title:"Components/UsefulLinks",component:a,tags:["autodocs"],args:{userId:"123456"},parameters:{docs:{description:{component:`
# Componente: UsefulLinks

**UsefulLinks** permite a un usuario añadir, visualizar y eliminar enlaces útiles personalizados con nombre, URL e icono.

---

## 🎯 Funcionalidad

- Agregar un nuevo enlace con:
  - Nombre (\`name\`)
  - URL (\`url\`)
  - Imagen de ícono (\`icon\`)
- Vista previa del ícono al subirlo.
- Enlaces listados con opción de eliminarlos.
- Los enlaces se abren en una nueva pestaña.

---

## 🧠 ViewModel

Utiliza el hook \`useUsefulLinksViewModel(userId)\`, que encapsula toda la lógica:

- \`links\`: lista actual del usuario
- \`newLink\`: estado temporal del nuevo enlace
- \`addLink()\`: función para añadir
- \`removeLink(index)\`: elimina enlace específico
- \`handleIconUpload()\`: procesa la carga de una imagen como base64
- \`fileInputRef\`: referencia para el input de tipo file (oculto)

---

## 🌍 Internacionalización

Este componente se adapta al idioma con **react-i18next**, usando el namespace \`global\`.

Las claves utilizadas incluyen:
- \`links.title\`
- \`links.name_placeholder\`
- \`links.url_placeholder\`
- \`links.upload_icon\`
- \`links.add\`
- \`links.remove\`

---

## 📦 Dependencias

- \`react-icons\`: para el ícono de subir archivo (\`FaUpload\`).
- \`react-i18next\`: traducción de textos.
- \`tailwindcss\`: para el layout, responsividad y diseño adaptativo.

---

## 📐 Props

| Prop     | Tipo     | Descripción                          |
|----------|----------|--------------------------------------|
| \`userId\` | \`string\` | Identificador del usuario propietario de los enlaces |

---

## 📸 Diseño y experiencia

- Totalmente responsivo (grid adaptable).
- Soporta temas claro/oscuro con clases \`dark:\`.
- Transiciones suaves para interacciones visuales.
- Imagen del ícono con hover/zoom.

        `}}}},e={parameters:{docs:{description:{story:"Renderiza el componente con los controles para agregar, previsualizar y eliminar enlaces útiles personalizados."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Renderiza el componente con los controles para agregar, previsualizar y eliminar enlaces útiles personalizados."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const t=["Default"];export{e as Default,t as __namedExportsOrder,c as default};
