import{T as o}from"./Toolbox-Bsi7Ohkv.js";import{C as a}from"./index.min-DYG32Kur.js";import"./iframe-Ce_CfLMD.js";import"./index-BW6WDUaj.js";import"./clsx-B-dksMZM.js";/* empty css                      */const r=new a,l={title:"Components/Toolbox",component:o,tags:["autodocs"],args:{canvas:r},parameters:{docs:{description:{component:`
# Componente: Toolbox 🎨

La **Toolbox** es una barra de herramientas avanzada que permite editar y manipular un lienzo \`fabric.js\` con múltiples funciones interactivas.

---

## 🧩 Funcionalidades principales

- **Descarga y limpieza del lienzo**
- **Añadir texto personalizado** con color y edición
- **Modo dibujo libre** con tipo de pincel, color y grosor:
  - Lápiz
  - Círculo
  - Spray
- **Zoom in / Zoom out**
- **Formas geométricas**:
  - Rectángulo (cálculo de área)
  - Círculo (cálculo de volumen)
- **Herramienta de medición** (línea con distancia)
- **Historial de acciones** con _Deshacer/Rehacer_
- **Subida y recorte de imágenes**

---

## 🔁 Estados internos gestionados

| Estado React        | Propósito                                  |
|---------------------|---------------------------------------------|
| \`drawingMode\`       | Activar o desactivar modo de dibujo        |
| \`brushColor\`       | Color del pincel                           |
| \`brushWidth\`       | Grosor del pincel                          |
| \`textColor\`        | Color del texto o figura seleccionada      |
| \`zoomLevel\`        | Nivel de zoom aplicado al lienzo           |
| \`history\`, \`historyIndex\` | Control del historial para deshacer/rehacer |
| \`isDrawingRect\`, \`isDrawingCircle\`, \`isDrawingLine\` | Modos activos de figura         |

---

## 🧠 Dependencias clave

- \`fabric\` — motor principal para el lienzo vectorial.
- \`@fortawesome/react-fontawesome\` — íconos de herramientas.
- \`react-toastify\` — notificaciones al usuario.
- \`prompt()\` nativo para entrada de texto (puede mejorarse luego con UI).

---

## ⚙️ Props

| Prop   | Tipo        | Descripción                                         |
|--------|-------------|-----------------------------------------------------|
| canvas | \`fabric.Canvas\` | Instancia activa del lienzo sobre el que se opera |

---

## 🧪 Nota técnica

Este componente **no se renderiza de forma aislada**: necesita un \`canvas\` real de \`fabric.js\`. Se recomienda usarlo junto a un componente \`CanvasContainer\` o contexto compartido si se integra en una app más compleja.

---
        `}}}},e={parameters:{docs:{description:{story:"Panel de herramientas para dibujo, edición, zoom y medición en el canvas. Este ejemplo usa una instancia ficticia de fabric.js para Storybook."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Panel de herramientas para dibujo, edición, zoom y medición en el canvas. Este ejemplo usa una instancia ficticia de fabric.js para Storybook."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const p=["Default"];export{e as Default,p as __namedExportsOrder,l as default};
