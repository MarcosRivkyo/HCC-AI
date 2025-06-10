import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useModelsViewModel } from "../../viewmodels/useModelsViewModel";

const ModelosDisponibles = () => {
  const { models, language } = useModelsViewModel();

  const { t } = useTranslation("global");

  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  const modelosPorPagina = 2;

  const tipoTraducciones: { [key: string]: string } = {
    Todos: t("models_disponibles.all"),
    Clasificación: t("models_disponibles.classification"),
    Segmentación: t("models_disponibles.segmentation"),
    Generativo: t("models_disponibles.generative"),
  };

  const tiposUnicos = useMemo(() => {
    return [
      "Todos",
      ...new Set(models.map((m) => m.modelType || "Desconocido")),
    ];
  }, [models]);

  const modelosFiltrados = useMemo(() => {
    return models.filter((modelo) => {
      const coincideNombre = modelo.modelName
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideTipo =
        filtroTipo === "Todos" || modelo.modelType === filtroTipo;
      return coincideNombre && coincideTipo;
    });
  }, [models, busqueda, filtroTipo]);

  const indiceInicio = (paginaActual - 1) * modelosPorPagina;
  const modelosPaginados = modelosFiltrados.slice(
    indiceInicio,
    indiceInicio + modelosPorPagina,
  );

  const siguientePagina = () => {
    if (paginaActual * modelosPorPagina < modelosFiltrados.length) {
      setPaginaActual((prev) => prev + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700 mr-6">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder={t("models_disponibles.search")}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-sm"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />

        <select
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-sm"
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value);
            setPaginaActual(1);
          }}
        >
          {tiposUnicos.map((tipo, idx) => (
            <option key={idx} value={tipo}>
              {tipoTraducciones[tipo] || tipo}
            </option>
          ))}
        </select>
      </div>

      {/* Encabezados */}
      <div className="flex justify-between items-center text-gray-700 dark:text-gray-200 font-semibold p-4 bg-gray-200 dark:bg-gray-800 rounded-t-lg shadow-sm">
        <span className="w-1/4 text-center">
          {t("models_disponibles.model")}
        </span>
        <span className="w-1/4 text-center">
          {t("models_disponibles.description")}
        </span>
        <span className="w-1/4 text-center">
          {t("models_disponibles.type")}
        </span>
        <span className="w-1/4 text-center">
          {t("models_disponibles.date")}
        </span>
      </div>

      {/* Lista */}
      <ul className="space-y-4 mb-4">
        {modelosPaginados.length > 0 ? (
          modelosPaginados.map((modelo, index) => (
            <li
              key={modelo.modelName || `model-${index}`}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white w-full md:w-1/4 truncate">
                {modelo.modelName ||
                  `${t("models_disponibles.model")} ${index + 1}`}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 italic w-full md:w-1/4 text-center">
                {modelo.description || t("models_disponibles.no_description")}
              </p>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-full md:w-1/4 text-center">
                {tipoTraducciones[modelo.modelType] ||
                  modelo.modelType ||
                  t("models_disponibles.unknown_type")}
              </span>

              <p className="text-sm text-gray-600 dark:text-gray-300 w-full md:w-1/4 text-center mt-2 md:mt-0">
                {modelo.trainDate?.toDate
                  ? modelo.trainDate.toDate().toLocaleString(language, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : t("models_disponibles.no_date")}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">
            {t("models_disponibles.no_models")}
          </p>
        )}
      </ul>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={paginaAnterior}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
          disabled={paginaActual === 1}
        >
          {t("models_disponibles.previous")}
        </button>
        <span className="text-gray-600 dark:text-gray-300">
          {t("models_disponibles.page")} {paginaActual}{" "}
          {t("models_disponibles.of")}{" "}
          {Math.ceil(modelosFiltrados.length / modelosPorPagina) || 1}
        </span>
        <button
          onClick={siguientePagina}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
          disabled={paginaActual * modelosPorPagina >= modelosFiltrados.length}
        >
          {t("models_disponibles.next")}
        </button>
      </div>
    </div>
  );
};

export default ModelosDisponibles;
