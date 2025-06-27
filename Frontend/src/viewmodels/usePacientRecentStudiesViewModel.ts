// src/viewmodels/useEstudiosRecientesPacienteViewModel.ts

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDAO } from "../data/dao/AuthDAO";
import { StudyDAO } from "../data/dao/StudyDAO";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useEstudiosRecientesPacienteViewModel = () => {
  const [estudios, setEstudios] = useState<any[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const estudiosPorPagina = 5;
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");

  useEffect(() => {
    const fetchEstudios = async () => {
      const user = AuthDAO.getCurrentUser();
      if (!user) return;
      try {
        const allStudies = await StudyDAO.getStudiesByPatientId(user.uid);
        setEstudios(allStudies);
      } catch (error) {
        console.error("Error al obtener estudios del paciente:", error);
      }
    };

    fetchEstudios();
  }, []);

  const estudiosFiltrados = estudios.filter((e) => {
    const coincideNombre = e.studieName
      ?.toLowerCase()
      .includes(busquedaNombre.toLowerCase());
    const coincideEstado =
      filtroEstado === "Todos" || e.status === filtroEstado;
    const coincideFecha =
      !filtroFecha ||
      (e.studieDate?.toDate &&
        e.studieDate.toDate().toISOString().slice(0, 10) === filtroFecha);

    return coincideNombre && coincideEstado && coincideFecha;
  });

  const indiceInicio = (paginaActual - 1) * estudiosPorPagina;
  const estudiosPaginados = estudiosFiltrados.slice(
    indiceInicio,
    indiceInicio + estudiosPorPagina,
  );

  const verEstudioDetalle = (id: string) => navigate(`/estudio/${id}`);

  const descargarEstudio = (id: string) => {
    const estudio = estudios.find((e) => e.id === id);
    if (!estudio?.pdfReportUrl) {
      toast.error(t("dashboard.no_pdf_found"));
      return;
    }
    window.open(estudio.pdfReportUrl, "_blank");
  };

  return {
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
  };
};
