import{j as e}from"./iframe-DsIhDsZN.js";import{useMDXComponents as o}from"./index-BmFUujZK.js";function i(s){const n={code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{id:"useestudiodetalleviewmodel",children:e.jsx(n.code,{children:"useEstudioDetalleViewModel"})}),`
`,e.jsxs(n.p,{children:["Este ",e.jsx(n.em,{children:"custom hook"})," encapsula toda la lógica funcional y de interfaz para la vista de detalle de un estudio clínico en la plataforma ",e.jsx(n.strong,{children:"HCC-AI"}),"."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-dependencias",children:"🧩 Dependencias"}),`
`,e.jsx(n.p,{children:"Este hook hace uso de:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"react-router-dom"}),": navegación y acceso a parámetros de ruta"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"firebase"}),": autenticación y Firestore"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"axios"}),": comunicación HTTP"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"jsPDF"}),", ",e.jsx(n.code,{children:"html2canvas"}),": generación de documentos"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"marked"}),": parseo de markdown para explicaciones"]}),`
`,e.jsxs(n.li,{children:["DAOs personalizados: ",e.jsx(n.code,{children:"AuthDAO"}),", ",e.jsx(n.code,{children:"UserDAO"}),", ",e.jsx(n.code,{children:"StudyDAO"}),", ",e.jsx(n.code,{children:"FileDAO"})]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-estados-principales-expuestos",children:"🧠 Estados principales expuestos"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`// Datos del estudio y usuario
estudio: Estudio | null
user: any
userData: any

// Estados de interfaz
loading: boolean
editing: boolean
theme: "light" | "dark"
language: string
showModal: boolean
showEmailModal: boolean
showAssistant: boolean

// Imagen y predicción
imagenSeleccionada: File | null
prediction: { predicted_class: number; probabilities: number[] } | null
segmentation: { segmented_image_url: string } | null
`})})]})}function a(s={}){const{wrapper:n}={...o(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{a as default};
