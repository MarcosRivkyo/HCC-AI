import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, getFirestore } from "firebase/firestore";

import { Study } from "../models/Studies";
import { StudyDAO } from "../data/dao/StudyDAO";

export const useMisEstudios = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [estudios, setEstudios] = useState<Study[]>([]);
  const [vista, setVista] = useState<"mios" | "compartidos" | "todos">("mios");

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [ordenFecha, setOrdenFecha] = useState<"asc" | "desc">("desc");
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState<
    string | null
  >(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    studieName: "",
    status: "En Progreso",
    studieDate: "",
    patientName: "",
    doctorName: "",
    doctorId: "",
    patientId: "",
    clinicalDescription: "",
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "es",
  );
  const [scale, setScale] = useState<number>(
    parseFloat(localStorage.getItem("uiScale") || "1"),
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true",
  );
  const [pacientes, setPacientes] = useState<{ id: string; name: string }[]>(
    [],
  );
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userSnap = await getDoc(
          doc(getFirestore(getAuth().app), "hcc_ai_users", currentUser.uid),
        );
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          const fetched = await StudyDAO.getFilteredStudies(
            currentUser.uid,
            vista,
          );
          setEstudios(fetched);
        }
      }
    });
    return () => unsubscribe();
  }, [vista]);

  const crearEstudio = async (formData: any) => {
    if (!user) return;
    const id = await StudyDAO.createStudy(user.uid, userData, formData);
    const updated = await StudyDAO.getFilteredStudies(user.uid, vista);
    setEstudios(updated);
    return id;
  };

  const eliminarEstudioVM = async (id: string) => {
    await StudyDAO.deleteStudyWithPrediction(id);
    const updated = await StudyDAO.getFilteredStudies(user.uid, vista);
    setEstudios(updated);
  };

  const refetchEstudios = async () => {
    if (!user) return;
    const updated = await StudyDAO.getFilteredStudies(user.uid, vista);
    setEstudios(updated);
  };

  const estudiosFiltrados = estudios
    .filter(
      (e) =>
        e.studieName.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.id.toLowerCase().includes(busqueda.toLowerCase()),
    )
    .filter((e) => (estadoFiltro ? e.status === estadoFiltro : true))
    .filter((e) => {
      if (!fechaFiltro) return true;
      const fecha = e.studieDate?.toDate?.()?.toISOString().split("T")[0];
      return fecha === fechaFiltro;
    })
    .sort((a, b) => {
      const fA = a.studieDate?.toDate?.().getTime() || 0;
      const fB = b.studieDate?.toDate?.().getTime() || 0;
      return ordenFecha === "asc" ? fA - fB : fB - fA;
    });

  return {
    user,
    userData,
    estudios,
    estudiosFiltrados,
    vista,
    setVista,
    estadoFiltro,
    setEstadoFiltro,
    ordenFecha,
    setOrdenFecha,
    busqueda,
    setBusqueda,
    fechaFiltro,
    setFechaFiltro,
    crearEstudio,
    eliminarEstudioVM,
    refetchEstudios,
    paginaActual,
    setPaginaActual,
    confirmarEliminacion,
    setConfirmarEliminacion,
    mostrarFormulario,
    setMostrarFormulario,
    formData,
    setFormData,
    isProfileOpen,
    setIsProfileOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    showAssistant,
    setShowAssistant,
    theme,
    setTheme,
    language,
    setLanguage,
    scale,
    setScale,
    highContrast,
    setHighContrast,
    pacientes,
    setPacientes,
  };
};
