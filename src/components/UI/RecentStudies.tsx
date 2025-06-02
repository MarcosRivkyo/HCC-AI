import React, { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaDownload, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

interface EstudiosRecientesProps {
  onEstudiosActualizados?: () => void;
}

const EstudiosRecientes: React.FC<EstudiosRecientesProps> = ({
  onEstudiosActualizados,
}) => {
  const [estudios, setEstudios] = useState<
    { id: string; [key: string]: any }[]
  >([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const estudiosPorPagina = 5;
  const [menuActivo, setMenuActivo] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState<
    string | null
  >(null);
  const { t, i18n } = useTranslation("global");

  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");

  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstudios = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "hcc_ai_studies"),
          where("doctorId", "==", user.uid),
          orderBy("studieDate", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const estudiosDelUsuario = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEstudios(estudiosDelUsuario);
        if (onEstudiosActualizados) onEstudiosActualizados();
      } catch (error) {
        console.error("Error al obtener los estudios:", error);
      }
    };
    fetchEstudios();
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuActivo(null);
      }
    };

    if (menuActivo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuActivo]);

  const estudiosFiltrados = estudios.filter((estudio) => {
    const coincideNombre = estudio.studieName
      ?.toLowerCase()
      .includes(busquedaNombre.toLowerCase());
    const coincideEstado =
      filtroEstado === "Todos" || estudio.status === filtroEstado;
    const coincideFecha =
      filtroFecha === "" ||
      (estudio.studieDate?.toDate &&
        estudio.studieDate.toDate().toISOString().slice(0, 10) === filtroFecha);

    return coincideNombre && coincideEstado && coincideFecha;
  });

  const indiceInicio = (paginaActual - 1) * estudiosPorPagina;
  const estudiosPaginados = estudiosFiltrados.slice(
    indiceInicio,
    indiceInicio + estudiosPorPagina,
  );

  const siguientePagina = () => {
    if (paginaActual * estudiosPorPagina < estudiosFiltrados.length) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const verEstudioDetalle = (id: string) => {
    navigate(`/estudio/${id}`);
  };

  const eliminarEstudio = async (id: string) => {
    try {
      await deleteDoc(doc(db, "hcc_ai_studies", id));
      setEstudios(estudios.filter((estudio) => estudio.id !== id));
      setConfirmarEliminacion(null);
    } catch (error) {
      console.error("Error al eliminar el estudio:", error);
    }
  };

  const descargarEstudio = (id: string) => {
    const estudio = estudios.find((e) => e.id === id);

    if (!estudio?.pdfReportUrl) {
      toast.error(t("dashboard.no_pdf_found"));
      return;
    }
    window.open(estudio.pdfReportUrl, "_blank");
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700 mr-6">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder={t("dashboard.search_by_name")}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg"
          value={busquedaNombre}
          onChange={(e) => {
            setBusquedaNombre(e.target.value);
            setPaginaActual(1);
          }}
        />

        <select
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg"
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value);
            setPaginaActual(1);
          }}
        >
          <option value="Todos">{t("dashboard.all_statuses")}</option>
          <option value="Finalizado">{t("dashboard.finished")}</option>
          <option value="En Progreso">{t("dashboard.pending")}</option>
        </select>

        <input
          type="date"
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg"
          value={filtroFecha}
          onChange={(e) => {
            setFiltroFecha(e.target.value);
            setPaginaActual(1);
          }}
        />
      </div>

      <div className="flex justify-between items-center text-gray-700 dark:text-gray-100 font-semibold p-4 bg-gray-200 dark:bg-gray-800 rounded-t-lg shadow-sm">
        <span className="w-1/3 text-center">{t("dashboard.study_name")}</span>
        <span className="w-1/3 text-center">{t("dashboard.status")}</span>
        <span className="w-1/3 text-center">{t("dashboard.study_date")}</span>
      </div>

      <ul className="space-y-4 mb-4">
        {estudiosPaginados.length > 0 ? (
          estudiosPaginados.map((estudio, index) => (
            <li
              key={estudio.id}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition-shadow"
            >
              <h3
                className="text-lg font-semibold text-gray-800 dark:text-white w-1/3 truncate cursor-pointer"
                onClick={() => verEstudioDetalle(estudio.id)}
              >
                {estudio.studieName || `${t("dashboard.study")} ${index + 1}`}
              </h3>

              <div className="flex items-center w-1/3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    estudio.status === "Finalizado"
                      ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                      : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                  }`}
                >
                  {t(
                    `dashboard.${estudio.status === "Finalizado" ? "finished" : "pending"}`,
                  )}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 w-1/3 text-right">
                {estudio.studieDate?.toDate
                  ? estudio.studieDate.toDate().toLocaleString(i18n.language, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : t("dashboard.no_date")}
              </p>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuActivo(
                      menuActivo === estudio.id ? null : estudio.id,
                    );
                  }}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                >
                  <FaEllipsisV />
                </button>

                  {menuActivo === estudio.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10"
                    >
                    <button
                      onClick={() => descargarEstudio(estudio.id)}
                      className="w-full flex items-center p-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaDownload className="mr-2" />
                      {t("dashboard.download")}
                    </button>
                    <button
                      onClick={() => setConfirmarEliminacion(estudio.id)}
                      className="w-full flex items-center p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <FaTrashAlt className="mr-2" />
                      {t("dashboard.delete")}
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {t("dashboard.no_recent_studies")}
          </p>
        )}
      </ul>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={paginaAnterior}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700"
          disabled={paginaActual === 1}
        >
          {t("dashboard.previous")}
        </button>
        <span className="text-gray-600 dark:text-gray-300">
          {t("dashboard.page")} {paginaActual} {t("dashboard.of")}{" "}
          {Math.ceil(estudiosFiltrados.length / estudiosPorPagina) || 1}
        </span>
        <button
          onClick={siguientePagina}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700"
          disabled={
            paginaActual * estudiosPorPagina >= estudiosFiltrados.length
          }
        >
          {t("dashboard.next")}
        </button>
      </div>

      {confirmarEliminacion && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t("dashboard.confirm_delete")}
            </h3>
            <div className="flex justify-between">
              <button
                onClick={() => eliminarEstudio(confirmarEliminacion)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {t("dashboard.delete")}
              </button>
              <button
                onClick={() => setConfirmarEliminacion(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg"
              >
                {t("dashboard.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudiosRecientes;
