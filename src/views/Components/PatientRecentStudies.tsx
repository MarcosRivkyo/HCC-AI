// src/components/EstudiosRecientesPaciente.tsx
import React, { useState, useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEstudiosRecientesPacienteViewModel } from "../../viewmodels/usePacientRecentStudiesViewModel";

const EstudiosRecientesPaciente: React.FC = () => {
  const {
    estudiosPaginados,
    paginaActual,
    setPaginaActual,
    busquedaNombre,
    setBusquedaNombre,
    filtroEstado,
    setFiltroEstado,
    filtroFecha,
    setFiltroFecha,
    estudiosFiltrados,
    verEstudioDetalle,
    descargarEstudio,
    t,
    i18n,
    estudiosPorPagina,
  } = useEstudiosRecientesPacienteViewModel();

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
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

      <div className="grid gap-4">
        {estudiosPaginados.length > 0 ? (
          estudiosPaginados.map((e) => (
            <div
              key={e.id}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md"
            >
              <div
                onClick={() => verEstudioDetalle(e.id)}
                className="w-1/2 cursor-pointer text-lg font-semibold text-gray-800 dark:text-white truncate hover:underline"
              >
                {e.studieName}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  e.status === "Finalizado"
                    ? "bg-green-200 text-green-800 dark:bg-green-300 dark:text-green-900"
                    : "bg-yellow-200 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900"
                }`}
              >
                {t(
                  `dashboard.${e.status === "Finalizado" ? "finished" : "pending"}`,
                )}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {e.studieDate?.toDate
                  ? e.studieDate.toDate().toLocaleDateString(i18n.language)
                  : t("dashboard.no_date")}
              </p>
              <button
                onClick={() => descargarEstudio(e.id)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-white"
              >
                <FaDownload />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {t("dashboard.no_recent_studies")}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700"
          disabled={paginaActual === 1}
        >
          {t("dashboard.previous")}
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          {t("dashboard.page")} {paginaActual} {t("dashboard.of")}{" "}
          {Math.ceil(estudiosFiltrados.length / estudiosPorPagina) || 1}
        </span>
        <button
          onClick={() =>
            setPaginaActual((p) =>
              p * estudiosPorPagina < estudiosFiltrados.length ? p + 1 : p,
            )
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700"
          disabled={
            paginaActual * estudiosPorPagina >= estudiosFiltrados.length
          }
        >
          {t("dashboard.next")}
        </button>
      </div>
    </div>
  );
};

export default EstudiosRecientesPaciente;
