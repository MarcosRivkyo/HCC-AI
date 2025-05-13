// MisEstudios.tsx
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { app } from "../../config/firebase";
import { FaDownload, FaTrashAlt } from "react-icons/fa";
import NavbarSecond from "../UI/NavbarSecond";
import ProfileModal from "../UI/ProfileModal";
import Assistant from "./Assistant.tsx";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SettingsModal from "../UI/SettingsModal";

interface Estudio {
  id: string;
  studieName: string;
  status: string;
  studieDate: any;
  doctorName: string;
  patientName: string;
  clinicalDescription?: string;
  imagenUrl?: string | null;
  doctorId: string;
  predictionId?: string;
  pdfReportUrl?: string;
}

const MisEstudios: React.FC = () => {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState<
    string | null
  >(null);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [ordenFecha, setOrdenFecha] = useState<"asc" | "desc">("desc");
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => setMostrarFormulario(false);
  const [formData, setFormData] = useState({
    studieName: "",
    status: "En Progreso",
    studieDate: "",
    patientName: "",
    doctorName: "",
    doctorId: "",
    clinicalDescription: "",
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const estudiosPorPagina = 6;
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDocs(
          query(
            collection(db, "hcc_ai_users"),
            where("__name__", "==", currentUser.uid),
          ),
        );
        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data());
        }
      }
    });
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    const fetchEstudios = async () => {
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
        })) as Estudio[];
        setEstudios(estudiosDelUsuario);
      } catch (error) {
        console.error("Error al obtener los estudios:", error);
      }
    };
    fetchEstudios();
  }, [user]);

  const estudiosFiltrados = estudios
    .filter((e) => e.studieName.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((e) => (estadoFiltro ? e.status === estadoFiltro : true))
    .filter((e) => {
      if (!fechaFiltro) return true;
      const estudioFecha = e.studieDate?.toDate?.().toISOString().split("T")[0];
      return estudioFecha === fechaFiltro;
    })
    .sort((a, b) => {
      const fechaA = a.studieDate?.toDate ? a.studieDate.toDate().getTime() : 0;
      const fechaB = b.studieDate?.toDate ? b.studieDate.toDate().getTime() : 0;
      return ordenFecha === "asc" ? fechaA - fechaB : fechaB - fechaA;
    });

  const indiceInicio = (paginaActual - 1) * estudiosPorPagina;
  const estudiosPaginados = estudiosFiltrados.slice(
    indiceInicio,
    indiceInicio + estudiosPorPagina,
  );

  const verEstudioDetalle = (id: string) => navigate(`/estudio/${id}`);

  const descargarPDF = (pdfReportUrl?: string) => {
    if (!pdfReportUrl) {
      toast.error(
        "No se encontró el informe PDF. Asegúrate de haber generado el análisis primero.",
      );
      return;
    }

    window.open(pdfReportUrl, "_blank");
  };

  const eliminarEstudio = async (id: string) => {
    try {
      await deleteDoc(doc(db, "hcc_ai_studies", id));
      setEstudios(estudios.filter((e) => e.id !== id));
      setConfirmarEliminacion(null);
    } catch (error) {
      console.error("Error al eliminar el estudio:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      const existingQuery = query(
        collection(db, "hcc_ai_studies"),
        where("studieName", "==", formData.studieName),
        where("doctorId", "==", user.uid),
      );

      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        toast.warning(
          "Ya existe un estudio con ese nombre. Elige otro nombre.",
        );
        return;
      }
      const finalDate = new Date(formData.studieDate);
      finalDate.setHours(12);
      const studieDateTimestamp = Timestamp.fromDate(finalDate);

      await addDoc(collection(db, "hcc_ai_studies"), {
        ...formData,
        studieDate: studieDateTimestamp,
        doctorId: user.uid,
        doctorName: userData?.firstName || user.displayName || user.email,
      });

      cerrarFormulario();
      setFormData({
        studieName: "",
        status: "En Progreso",
        studieDate: "",
        patientName: "",
        doctorName: "",
        doctorId: "",
        clinicalDescription: "",
      });

      const q = query(
        collection(db, "hcc_ai_studies"),
        where("doctorId", "==", user.uid),
        orderBy("studieDate", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const nuevosEstudios = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Estudio[];
      setEstudios(nuevosEstudios);
    } catch (error) {
      console.error("Error al crear el estudio:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <NavbarSecond
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAssistantClick={() => setShowAssistant(!showAssistant)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
        user={user}
      />

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        scale={scale}
        setScale={setScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        userData={userData}
      />

      <div className="relative">
        {/* Asistente flotante */}
        <div
          className={`fixed top-20 bottom-1 right-0 w-1/4 bg-gray-800 text-white p-4 transition-transform transform ${
            showAssistant ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ zIndex: 1000 }}
        >
          <Assistant />
        </div>
      </div>
      <main className="flex-grow container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-gray-800 mt-8 mb-8 text-center">
          Estudios
        </h1>

        <div className="bg-white rounded-xl shadow p-4 mt-6 mb-8 flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <button
            onClick={abrirFormulario}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow w-full md:w-auto"
          >
            Crear Estudio
          </button>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre"
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4"
          />

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Finalizado">Finalizado</option>
          </select>

          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4"
          />

          <select
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value as "asc" | "desc")}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguos</option>
          </select>
        </div>

        {estudiosPaginados.length === 0 ? (
          <p className="text-center text-gray-500">No hay estudios</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {estudiosPaginados.map((estudio) => (
              <div
                key={estudio.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105"
              >
                {estudio.imagenUrl ? (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={estudio.imagenUrl}
                      alt="Miniatura"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-200" />
                )}
                <div className="p-5">
                  <h2
                    onClick={() => verEstudioDetalle(estudio.id)}
                    className="text-lg font-bold text-blue-700 cursor-pointer hover:underline truncate"
                  >
                    {estudio.studieName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {estudio.studieDate?.toDate
                      ? estudio.studieDate.toDate().toLocaleDateString("es-ES")
                      : "Sin fecha"}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${estudio.status === "Finalizado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {estudio.status}
                  </span>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => descargarPDF(estudio.pdfReportUrl)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => setConfirmarEliminacion(estudio.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {estudiosFiltrados.length > estudiosPorPagina && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Anterior
            </button>
            <span className="text-gray-600">
              Página {paginaActual} de{" "}
              {Math.ceil(estudiosFiltrados.length / estudiosPorPagina)}
            </span>
            <button
              onClick={() =>
                setPaginaActual((p) =>
                  p * estudiosPorPagina < estudiosFiltrados.length ? p + 1 : p,
                )
              }
              disabled={
                paginaActual * estudiosPorPagina >= estudiosFiltrados.length
              }
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Nuevo Estudio
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="studieName"
                value={formData.studieName}
                onChange={handleChange}
                placeholder="Nombre del estudio"
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="date"
                name="studieDate"
                value={formData.studieDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Nombre del paciente"
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                name="clinicalDescription"
                value={formData.clinicalDescription}
                onChange={handleChange}
                placeholder="Descripción clínica"
                className="w-full border px-3 py-2 rounded-md"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmarEliminacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              ¿Eliminar este estudio?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => eliminarEstudio(confirmarEliminacion)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmarEliminacion(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-white text-center p-4 w-full mt-auto shadow-lg rounded-t-lg mb-0">
        © 2025 HCC-AI
      </footer>
    </div>
  );
};

export default MisEstudios;
