import{r as T,u as _,j as e}from"./iframe-CtcKxV_0.js";import{h as z,i as q,j as R}from"./index-DNyRBZ_W.js";import{L as M}from"./index-BrM8sVuJ.js";/* empty css                      */import{u as S}from"./useRecentStudiesViewModel-Bs2BgPrE.js";import{u as $}from"./useTranslation-BpOnEeka.js";import"./clsx-B-dksMZM.js";import"./AuthDAO-Dq-0zJDM.js";import"./firebase-C7NIwWUw.js";import"./StudyDAO-fVGuTzCR.js";const m=({mockData:d})=>{const{setPaginaActual:r,busquedaNombre:p,setBusquedaNombre:x,filtroEstado:h,setFiltroEstado:b,filtroFecha:y,setFiltroFecha:f,eliminarEstudio:w,confirmarEliminacion:l,setConfirmarEliminacion:c,descargarEstudio:j,menuActivo:u,setMenuActivo:k,menuRef:N}=S(),g=d?.estudiosPaginados??[],i=d?.estudiosFiltrados??[],s=d?.paginaActual??1,[H,Q]=T.useState([]),o=5,{t:a,i18n:v}=$("global"),D=_(),E=()=>{s*o<i.length&&r(s+1)},F=()=>{s>1&&r(s-1)},C=t=>{D(`/estudio/${t}`)};return e.jsxs("div",{className:"w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700 mr-6",children:[e.jsx(M,{}),e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-center gap-4 mb-6",children:[e.jsx("input",{type:"text",placeholder:a("dashboard.search_by_name"),className:"w-full md:w-1/3 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg",value:p,onChange:t=>{x(t.target.value),r(1)}}),e.jsxs("select",{className:"w-full md:w-1/4 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg",value:h,onChange:t=>{b(t.target.value),r(1)},children:[e.jsx("option",{value:"Todos",children:a("dashboard.all_statuses")}),e.jsx("option",{value:"Finalizado",children:a("dashboard.finished")}),e.jsx("option",{value:"En Progreso",children:a("dashboard.pending")})]}),e.jsx("input",{type:"date",className:"w-full md:w-1/4 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg",value:y,onChange:t=>{f(t.target.value),r(1)}})]}),e.jsxs("div",{className:"flex justify-between items-center text-gray-700 dark:text-gray-100 font-semibold p-4 bg-gray-200 dark:bg-gray-800 rounded-t-lg shadow-sm",children:[e.jsx("span",{className:"w-1/3 text-center",children:a("dashboard.study_name")}),e.jsx("span",{className:"w-1/3 text-center",children:a("dashboard.status")}),e.jsx("span",{className:"w-1/3 text-center",children:a("dashboard.study_date")})]}),e.jsx("ul",{className:"space-y-4 mb-4",children:g.length>0?g.map((t,P)=>e.jsxs("li",{className:"p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition-shadow",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-800 dark:text-white w-1/3 truncate cursor-pointer",onClick:()=>C(t.id),children:t.studieName||`${a("dashboard.study")} ${P+1}`}),e.jsx("div",{className:"flex items-center w-1/3",children:e.jsx("span",{className:`px-3 py-1 rounded-full text-sm font-medium ${t.status==="Finalizado"?"bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900":"bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"}`,children:a(`dashboard.${t.status==="Finalizado"?"finished":"pending"}`)})}),e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-300 w-1/3 text-right",children:t.studieDate?.toDate?t.studieDate.toDate().toLocaleString(v.language,{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}):a("dashboard.no_date")}),e.jsxs("div",{className:"relative",children:[e.jsx("button",{onClick:A=>{A.stopPropagation(),k(u===t.id?null:t.id)},className:"text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none",children:e.jsx(z,{})}),u===t.id&&e.jsxs("div",{ref:N,className:"absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10",children:[e.jsxs("button",{onClick:()=>j(t.id),className:"w-full flex items-center p-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",children:[e.jsx(q,{className:"mr-2"}),a("dashboard.download")]}),e.jsxs("button",{onClick:()=>c(t.id),className:"w-full flex items-center p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900",children:[e.jsx(R,{className:"mr-2"}),a("dashboard.delete")]})]})]})]},t.id)):e.jsx("p",{className:"text-gray-500 dark:text-gray-400 text-center",children:a("dashboard.no_recent_studies")})}),e.jsxs("div",{className:"flex justify-between items-center mt-4",children:[e.jsx("button",{onClick:F,className:"px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700",disabled:s===1,children:a("dashboard.previous")}),e.jsxs("span",{className:"text-gray-600 dark:text-gray-300",children:[a("dashboard.page")," ",s," ",a("dashboard.of")," ",Math.ceil(i.length/o)||1]}),e.jsx("button",{onClick:E,className:"px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700",disabled:s*o>=i.length,children:a("dashboard.next")})]}),l&&e.jsx("div",{className:"absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50",children:e.jsxs("div",{className:"bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-800 dark:text-white mb-4",children:a("dashboard.confirm_delete")}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("button",{onClick:()=>w(l),className:"px-4 py-2 bg-red-500 text-white rounded-lg",children:a("dashboard.delete")}),e.jsx("button",{onClick:()=>c(null),className:"px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg",children:a("dashboard.cancel")})]})]})})]})};m.__docgenInfo={description:"",methods:[],displayName:"EstudiosRecientes",props:{onEstudiosActualizados:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},mockData:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  estudiosPaginados: any[];
  estudiosFiltrados: any[];
  paginaActual: number;
}`,signature:{properties:[{key:"estudiosPaginados",value:{name:"Array",elements:[{name:"any"}],raw:"any[]",required:!0}},{key:"estudiosFiltrados",value:{name:"Array",elements:[{name:"any"}],raw:"any[]",required:!0}},{key:"paginaActual",value:{name:"number",required:!0}}]}},description:""}}};const X={title:"Components/EstudiosRecientes",component:m,tags:["autodocs"],parameters:{docs:{description:{component:`
Componente **EstudiosRecientes** que permite listar, filtrar, descargar y eliminar estudios clínicos recientes.

### Características:
- Búsqueda por nombre, estado y fecha.
- Soporta paginación.
- Muestra menú de acciones por estudio.
- Modal de confirmación para eliminar.
        `}}}},n={name:"Vista por defecto",args:{mockData:{paginaActual:1,estudiosPaginados:[{id:"1",studieName:"Estudio Hepático 01",status:"Finalizado",studieDate:{toDate:()=>new Date("2024-01-15T14:30:00")}},{id:"2",studieName:"Control Quirúrgico",status:"En Progreso",studieDate:{toDate:()=>new Date("2024-02-20T09:00:00")}}],estudiosFiltrados:[{id:"1",studieName:"Estudio Hepático 01",status:"Finalizado",studieDate:{toDate:()=>new Date("2024-01-15T14:30:00")}},{id:"2",studieName:"Control Quirúrgico",status:"En Progreso",studieDate:{toDate:()=>new Date("2024-02-20T09:00:00")}}]}},parameters:{docs:{description:{story:"Estudios recientes simulados con opciones de filtro, acciones y eliminación."}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "Vista por defecto",
  args: {
    mockData: {
      paginaActual: 1,
      estudiosPaginados: [{
        id: "1",
        studieName: "Estudio Hepático 01",
        status: "Finalizado",
        studieDate: {
          toDate: () => new Date("2024-01-15T14:30:00")
        }
      }, {
        id: "2",
        studieName: "Control Quirúrgico",
        status: "En Progreso",
        studieDate: {
          toDate: () => new Date("2024-02-20T09:00:00")
        }
      }],
      estudiosFiltrados: [{
        id: "1",
        studieName: "Estudio Hepático 01",
        status: "Finalizado",
        studieDate: {
          toDate: () => new Date("2024-01-15T14:30:00")
        }
      }, {
        id: "2",
        studieName: "Control Quirúrgico",
        status: "En Progreso",
        studieDate: {
          toDate: () => new Date("2024-02-20T09:00:00")
        }
      }]
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Estudios recientes simulados con opciones de filtro, acciones y eliminación."
      }
    }
  }
}`,...n.parameters?.docs?.source}}};const Y=["Default"];export{n as Default,Y as __namedExportsOrder,X as default};
