import{T as a}from"./Toolbox-Crj49nNB.js";import{C as o}from"./index.min-DYG32Kur.js";import"./iframe-CtcKxV_0.js";import"./index-BrM8sVuJ.js";import"./clsx-B-dksMZM.js";/* empty css                      */const n=new o,l={title:"Components/Toolbox",component:a,tags:["autodocs"],args:{canvas:n},parameters:{docs:{description:{component:`
El componente **Toolbox** representa una barra de herramientas interactiva para manipulación avanzada sobre un lienzo de tipo \`fabric.Canvas\`.
Permite aplicar transformaciones gráficas, crear objetos, realizar mediciones y ejecutar acciones como zoom o descarga, integrándose dentro de entornos clínicos o educativos donde se requiera anotación o edición gráfica directa.

### Funcionalidades principales:
- Limpieza del lienzo y descarga en imagen.
- Creación de texto personalizado con color configurado.
- Dibujo libre con pinceles: lápiz, círculo, spray.
- Zoom in / zoom out sobre el área de trabajo.
- Inserción de figuras geométricas:
  - Rectángulo (con cálculo de área).
  - Círculo (con cálculo de volumen).
- Medición con línea entre puntos (calculando distancia).
- Historial de acciones con funciones de deshacer/rehacer.
- Subida de imágenes y recorte previo a su inserción.

### Estado interno gestionado:
| Estado              | Propósito                                       |
|---------------------|--------------------------------------------------|
| \`drawingMode\`       | Activar el modo de dibujo libre                 |
| \`brushColor\`        | Color del trazo/pincel                         |
| \`brushWidth\`        | Grosor del trazo/pincel                        |
| \`textColor\`         | Color del texto o figura                       |
| \`zoomLevel\`         | Escala actual aplicada al lienzo              |
| \`history\`, \`historyIndex\` | Gestión del historial gráfico            |
| \`isDrawingRect\`, \`isDrawingCircle\`, \`isDrawingLine\` | Control de figuras activas |

### Dependencias clave:
- \`fabric.js\`: motor de gráficos vectoriales en canvas HTML5.
- \`@fortawesome/react-fontawesome\`: iconografía para la interfaz de herramientas.
- \`react-toastify\`: para mensajes de estado y retroalimentación al usuario.

### Props:
| Prop   | Tipo             | Descripción                                            |
|--------|------------------|--------------------------------------------------------|
| \`canvas\` | \`fabric.Canvas\` | Instancia activa del lienzo a manipular              |

### Consideraciones técnicas:
Este componente requiere una instancia activa de \`fabric.Canvas\` para funcionar correctamente, por lo que no es autosuficiente ni se puede visualizar de forma aislada. Para entornos productivos se recomienda integrarlo junto a un componente envoltorio como \`CanvasContainer\` o mediante un contexto global que provea la instancia del lienzo.
        `}}}},e={name:"Vista por defecto",parameters:{docs:{description:{story:"Demostración del panel de herramientas con una instancia simulada de lienzo. Incluye acciones de dibujo, formas, zoom, historial y gestión del canvas."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story: "Demostración del panel de herramientas con una instancia simulada de lienzo. Incluye acciones de dibujo, formas, zoom, historial y gestión del canvas."
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const m=["Default"];export{e as Default,m as __namedExportsOrder,l as default};
