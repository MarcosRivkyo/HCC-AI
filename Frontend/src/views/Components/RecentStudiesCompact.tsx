// src/views/Components/RecentStudiesCompact.tsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecentStudiesViewModel } from "../../viewmodels/useRecentStudiesViewModel";

const EstudiosRecientesCompact: React.FC = () => {
  const {
    estudios,
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
    eliminarEstudio,
    confirmarEliminacion,
    setConfirmarEliminacion,
    descargarEstudio,
    menuActivo,
    setMenuActivo,
    menuRef,
    irADetalle,
  } = useRecentStudiesViewModel();

  const { t, i18n } = useTranslation("global");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-full md:w-80">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        {t("dashboard.recent_studies")}
      </h3>
      <ul className="space-y-3">
        {estudios.map((estudio) => (
          <li
            key={estudio.id}
            onClick={() => irADetalle(estudio.id)}
            className="w-full flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg cursor-pointer transition"
          >
            {estudio.imagenUrl ? (
              <img
                src={estudio.imagenUrl}
                alt="Thumbnail"
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs"></div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-800 dark:text-white">
                {estudio.studieName || "Untitled"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {estudio.studieDate
                  ?.toDate?.()
                  .toLocaleDateString(i18n.language)}
              </p>
              <span
                className={`inline-block text-[10px] mt-1 px-2 py-[1px] rounded-full font-medium ${
                  estudio.status === "Finalizado"
                    ? "bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-200 dark:text-yellow-800"
                }`}
              >
                {estudio.status === "Finalizado"
                  ? t("my_studies.status_done")
                  : t("my_studies.status_in_progress")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstudiosRecientesCompact;
