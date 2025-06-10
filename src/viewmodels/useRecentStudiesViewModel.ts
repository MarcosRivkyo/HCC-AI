// src/viewmodels/useRecentStudiesViewModel.ts
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { AuthDAO } from "../data/dao/AuthDAO";
import { StudyDAO } from "../data/dao/StudyDAO";
import { useNavigate } from "react-router-dom";

export const useRecentStudiesViewModel = (
  onEstudiosActualizados?: () => void,
) => {
  const [estudios, setEstudios] = useState<any[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [menuActivo, setMenuActivo] = useState<string | null>(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState<
    string | null
  >(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");

  const estudiosPorPagina = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstudios = async () => {
      const user = AuthDAO.getCurrentUser();
      if (!user) return;

      try {
        const estudiosDelUsuario = await StudyDAO.getDoctorStudies(user.uid);
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

  const eliminarEstudio = async (id: string) => {
    try {
      await StudyDAO.deleteStudyWithPrediction(id);
      setEstudios(estudios.filter((estudio) => estudio.id !== id));
      setConfirmarEliminacion(null);
    } catch (error) {
      console.error("Error al eliminar el estudio:", error);
    }
  };

  const descargarEstudio = (id: string) => {
    const estudio = estudios.find((e) => e.id === id);
    if (!estudio?.pdfReportUrl) {
      toast.error("No se encontró el pdf");
      return;
    }
    window.open(estudio.pdfReportUrl, "_blank");
  };

  const irADetalle = (id: string) => {
    navigate(`/estudio/${id}`);
  };

  return {
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
  };
};
