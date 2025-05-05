import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase.ts";

import { v4 as uuidv4 } from 'uuid';

import Logout from "../Auth/Logout.tsx";
import Assistant from "./Assistant.tsx";
import usePreventZoom from "../UI/usePreventZoom.tsx";
import Modal from "../UI/Modal.tsx";
import DeleteAccountButton from "../UI/DeleteAccountButton.tsx";
import EstudiosRecientes from "../UI/EstudiosRecientes.tsx";
import ChangePasswordForm from "../UI/ChangePasswordForm.tsx";
import ModelosDisponibles from "../UI/ModelosDisponibles.tsx"
import ImageCarrousel from "../UI/ImageCarrousel.tsx";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import settingsIcon from "../../assets/images/settings_icon.png";
import logo_user from "../../assets/images/logo_user.png";


import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'; 
import { Timestamp } from "firebase/firestore";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {


  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState('Cuenta');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);


  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => setMostrarFormulario(false);

  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [isSaving, setIsSaving] = useState(false); // Added state for saving
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for preview image
  const [newUploadImage, setNewUploadImage] = useState<File | null>(null);


  const [pacientes, setPacientes] = useState<{ id: string; nombre: string }[]>([]);
  const [formData, setFormData] = useState({
    studieName: '',
    status: 'En Progreso',
    studieDate: '',
    pacienteId: '',  
    clinicalDescription: '',
  });


  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
  };
  

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  usePreventZoom(true, true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "hcc_ai_users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userDocData = userDoc.data();
          setUserData(userDocData);
        } else {
          console.log("No se encontró el documento del usuario.");
        }
      }
    });
  
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }
  
    return () => unsubscribe();
  }, [auth, db]);


  useEffect(() => {
    if (mostrarFormulario) {
      const fetchPacientes = async () => {
        const q = query(
          collection(db, 'hcc_ai_users'),
          where('jobTitle', '==', 'es')  
        );
        const querySnapshot = await getDocs(q);
        const pacientesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().userName + ' ' + doc.data().lastName, 
        }));
        
        setPacientes(pacientesData);
      };

      fetchPacientes();
    }
  }, [mostrarFormulario]);


  
  useEffect(() => {
    if (userData) {
      console.log("userData en el modal de perfil:", userData);
    }
  }, [userData]);



  

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    console.log("cambiar modo pantalla:", userData);

  };

  const handleToggle = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item); 
  };

  const uploadImage = async () => {

    if (!user) return;

    try {
      setIsSaving(true);
  
      const userId = user.uid;
      const folderPath = userData.imageFolder || `HCC-AI/users/${userId}`;

      if (newUploadImage) {
        const uniqueName = `${uuidv4()}_${newUploadImage.name}`;
        const storageRef = ref(storage, `${folderPath}/ecografias/${uniqueName}`);

        await uploadBytes(storageRef, newUploadImage);
        const imageUrl = await getDownloadURL(storageRef);

      }
  
      await updateDoc(doc(db, 'hcc_ai_users', user.uid), {
        imageFolder: folderPath
      });
  



  
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Hubo un error al guardar los cambios");
    } finally {
      setIsSaving(false);
      setNewProfileImage(null); 
    }


  };

  const updateUserData = async () => {

    if (!user) return;

    try {
      setIsSaving(true);
  
      let photoURL = userData?.profilePicture;
  
      const userId = user.uid;
      const folderPath = userData.imageFolder || `HCC-AI/users/${userId}`;

      if (newProfileImage) {

        const storageRef = ref(storage, `${folderPath}/profile_pictures/${user.uid}`);

        await uploadBytes(storageRef, newProfileImage);
        photoURL = await getDownloadURL(storageRef);
      }
  
      await updateProfile(user, {
        displayName: userName,
        photoURL: photoURL,
      });
  
  
      await updateDoc(doc(db, 'hcc_ai_users', user.uid), {
        firstName,
        lastName,
        phone,
        profilePicture: photoURL,
        email: user.email,
        jobTitle: userData.jobTitle,
      });
  
      setUserData((prev: typeof userData) => ({
        ...prev,
        firstName,
        lastName,
        phone,
        profilePicture: photoURL,
      }));


  
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Hubo un error al guardar los cambios");
    } finally {
      setIsSaving(false);
      setNewProfileImage(null); 
    }
  };
  
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
  
    // Obtener el usuario autenticado
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const uid = user.uid;
      const studieDateTimestamp = Timestamp.fromDate(new Date(formData.studieDate));

      try {
        // Guardar los datos en Firestore con el uid del médico (usuario)
        await addDoc(collection(db, "hcc_ai_studies"), {
          studieName: formData.studieName,
          status: formData.status,
          studieDate: studieDateTimestamp,
          pacienteId: formData.pacienteId,
          medicoId: uid,
          clinicalDescription: formData.clinicalDescription,
        });
  

        // Limpiar el formulario (opcional)
        setFormData({
          studieName: "",
          status: "En Progreso",
          studieDate: "",
          pacienteId: "",
          clinicalDescription: "",
        });
        
        // Cerrar el formulario
        cerrarFormulario();
        window.location.reload();
        
        toast.success("Estudio creado correctamente");


      } catch (error) {
        console.error("Error al crear el estudio: ", error);
        toast.error("Hubo un error al crear el estudio");
      }
    } else {
      console.log("El usuario no está autenticado.");
      toast.error("Debes de estar autenticado para crear un estudio");
    }
  };


  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  const handleImageSelect = (url: string) => {
    setSelectedImageUrl(url);
    console.log('Imagen seleccionada:', url);
  };

  const Clock = () => {
    const [time, setTime] = useState<string>(() =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    
    // Referencia para el calendario
    const calendarRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    // Función para cerrar el calendario si se hace clic fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
          setIsCalendarOpen(false);
        }
      };
  
      // Escuchar clics fuera del calendario
      document.addEventListener('mousedown', handleClickOutside);
  
      // Limpiar el event listener cuando se desmonta el componente
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    // Función para resaltar fines de semana (sábado y domingo)
    const tileClassName = ({ date }: any) => {
      const day = date.getDay(); // 0 es Domingo, 6 es Sábado
      if (day === 0 || day === 6) {
        return 'bg-red-500 text-white'; // Fin de semana en rojo
      }
      return ''; // Los días normales no tienen clase especial
    };
  
    return (
      <div className="relative">
        {/* Reloj interactivo */}
        <div 
          className="text-2xl text-gray-200 font-mono mr-4 tracking-wider cursor-pointer" 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
         {time}
        </div>
  
        {/* Calendario modal */}
        {isCalendarOpen && (
          <div 
            ref={calendarRef}
            className="absolute top-full right-0 mt-2 p-4 bg-gray-800 rounded-lg shadow-lg w-72 z-50"
          >
            <Calendar 
              tileClassName={tileClassName} // Aplica el estilo de fines de semana
              className="bg-gray-900 text-white border-none" // Fondo oscuro y texto blanco
            />
          </div>
        )}
      </div>
    );
  };
  

  return (
    
  <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
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
        theme={theme === 'dark' ? 'dark' : 'light'} // para que se adapte al tema
      />

      {/* Navbar */}
      <nav className="bg-black p-4 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
        {/* Menú de navegación */}

        <ul className="flex items-center space-x-14 text-sm">
          {[{ path: "/dashboard", label: "INICIO" }, { path: "/studies", label: "MIS ESTUDIOS" }, { path: "/models", label: "MODELOS" }].map((item, index) => (
            <li key={item.path} className={index === 0 ? "ml-8" : ""}>
              <button
                onClick={() => navigate(item.path)}
                className="hover:text-gray-300 py-2"
              >
                {item.label}
              </button>
            </li>
          ))}

          {/* Botón ASISTENTE con toggle */}
          <li>
            <button
              onClick={toggleAssistant}
              className="hover:text-gray-300 py-2"
            >
              ASISTENTE
            </button>
          </li>

          {/* Botón ANALIZAR destacado */}
          <li>
            <button
              onClick={() => navigate("/predict")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              ANALIZAR
            </button>
          </li>
        </ul>




        {/* Logo Central */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logoHCC_AI} className="w-32 max-w-full rounded-md cursor-pointer" alt="HCC-AI Logo" onClick={() => navigate("/dashboard")} />
        </div>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-4 relative w-72 justify-end">
          <Clock />

          <div className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-800 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
            <img src={ user?.photoURL || userData?.profilePicture || logo_user} alt="Perfil" className="w-10 h-10 max-w-full rounded-full" />
            <span className="font-semibold truncate">
            <span className="font-semibold truncate">
                {user?.displayName || (userData && (userData.firstName || userData.lastName) 
                ? `${userData.firstName} ${userData.lastName}` 
                : user?.email || "Usuario")}
            </span>

            </span>
          </div>

          {/* Menú desplegable de usuario */}
          {isOpen && (
            <div className="absolute top-full right-0 bg-gray-800 w-48 rounded-lg shadow-lg overflow-hidden mt-2" style={{ zIndex: 3000 }}>
              <button onClick={() => setIsProfileOpen(true)} className="block px-4 py-3 w-full text-left hover:bg-gray-700">👤 Ver Perfil</button>
              <button onClick={() => setIsSettingsOpen(true)} className="block px-4 py-3 w-full text-left hover:bg-gray-700">⚙️ Configuración</button>
              <Logout />
            </div>
          )}
        </div>
      </nav>
      {/* Contenido Principal */}


<div className={`flex-1 flex-col h-screen pt-24 px-6 bg-gray-50 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} `}>
  
  <div className={`flex pt-10 pb-10  px-6 h-full bg-gray-50 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>

    <div className="relative">
      {/* Asistente flotante */}
      <div
        className={`fixed top-0 right-0 w-1/4 h-full mt-20 mb-20 bg-gray-800 text-white p-4 transition-transform transform ${
          showAssistant ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 1000 }}
      >
        {/* Aquí iría el contenido del asistente */}
        <Assistant />
      </div>

      {/* Botón para mostrar/ocultar el asistente */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 ${
          showAssistant ? 'rotate-180' : ''
        }`}
        style={{ zIndex: 1001 }}
      >
        {showAssistant ? <FiArrowLeft size={24} /> : <FiArrowRight size={24} />}
      </button>
    </div>


  <div className="w-1/2 h-full bg-white rounded-lg shadow-md p-6 border border-gray-300 mr-6 flex flex-col">

    <h2 className="text-xl font-semibold text-gray-800 mb-4">Estudios Recientes</h2>
    
    <main className="flex-1 overflow-auto">
      {/* Contenido de Estudios Recientes */}
      <EstudiosRecientes />
    </main>

    <div className="mt-5">
      <button 
        onClick={abrirFormulario} 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4 mx-auto"
      >
        Crear Estudio
      </button>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center" style={{ zIndex: 1000 }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Crear Nuevo Estudio</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="studieName">
                  Nombre del Estudio
                </label>
                <input
                  id="studieName"
                  name="studieName"
                  type="text"
                  value={formData.studieName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>



              <div className="mb-4">
                <label className="block mb-2" htmlFor="studieDate">
                  Fecha de Estudio
                </label>
                <input
                  id="studieDate"
                  name="studieDate"
                  type="date"
                  value={formData.studieDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Selección de paciente */}
              <div className="mb-4">
                <label className="block mb-2" htmlFor="pacienteId">
                  Nombre del Paciente
                </label>

                <input
                  id="pacienteId"
                  name="pacienteId"
                  type="text"
                  value={formData.pacienteId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>


              <div className="mb-4">
                <label className="block mb-2" htmlFor="clinicalDescription">
                  Descripción Clínica
                </label>

                <input
                  id="clinicalDescription"
                  name="clinicalDescription"
                  type="text"
                  value={formData.clinicalDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />


              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Crear Estudio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>


    {/* Parte Derecha (mitad dividida en dos filas) */}
  <div className="w-1/2 h-full flex flex-col gap-6">

      <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Editor de Imágenes</h2>
        <div className="w-full h-full">

          {/* Fila de los botones */}
          <div className="flex justify-between gap-4 mb-4">
            {/* Botón Elegir Imagen */}
            <label
              htmlFor="fileInput"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-md cursor-pointer transition duration-300 w-auto"
            >
              Elegir Imagen
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewUploadImage(e.target.files[0]);
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      setPreviewImage(reader.result);
                    }
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Botón Guardar Cambios */}
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded-md transition duration-300"
              onClick={uploadImage}
            >
              Guardar Cambios
            </button>
          </div>

          {/* Carrusel de imágenes */}
          <ImageCarrousel onImageSelect={handleImageSelect} /> {/* Pasar la función de selección */}

          </div>
      </div>



      <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Modelos disponibles</h2>
        <main className="flex-1 overflow-auto">

          <ModelosDisponibles/>

        </main>
      </div>
    </div>
  </div>


  {/* Footer */}
  <footer className="bg-gray-900 text-white text-center p-4 w-full mt-auto shadow-lg rounded-t-lg mb-0">
    © 2025 HCC-AI
  </footer>

</div>





      {/* Modal de Perfil */}
      <Modal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} size="small">
        <p className="text-xl font-semibold mb-4 text-white text-center">
                {user?.displayName}        
        </p>
        <img src={ user?.photoURL || userData?.profilePicture || logo_user} alt="Perfil" className="w-20 h-20 max-w-full rounded-full mx-auto" />

        <p className="text-gray-500 text-center">{userData?.email || user?.email}</p>
        <p className="mt-2 text-gray-400 text-sm"> {userData?.firstName && userData?.lastName   ? `${userData.firstName} ${userData.lastName}`  : "Nombre no disponible"}</p>
        <p className="mt-2 text-gray-400 text-sm"> 📅 Registrado el: {userData?.createdAt ? userData.createdAt.toDate().toLocaleString() : "Fecha no disponible"}</p>
        <p className="mt-2 text-gray-400 text-sm"> ☎️ Teléfono: {userData?.phone || "Teléfono no disponible"}</p>
      </Modal>

      <Modal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} size="large">
      {/* Título */}

      
      <div className="flex h-full">
        {/* Parte Izquierda (1/4) */}
        <div className="w-1/4  p-4 rounded-lg shadow-md h-25">

        <div className="flex justify-center mb-4">
          <img src={settingsIcon} alt="Logo HCC_AI" className="w-20 h-20" />
        </div>

        <h2 className="text-3xl font-semibold mb-6 text-white text-center underline ">Configuración</h2>

          <ul className="space-y-6 text-white">
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => setActiveSection('Cuenta')}
            >
              Cuenta
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => setActiveSection('Preferencias')}
            >
              Preferencias
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => setActiveSection('Pantalla')}
            >
              Pantalla
            </li>
          </ul>
        </div>

        {/* Separador */}
        <div className="border-l-2 border-gray-600 mx-4 h-20"></div>

        {/* Parte Derecha (3/4) */}
        <div className="w-3/4 bg-gray-800 p-6 h-full overflow-y-auto rounded-lg shadow-lg">

        {activeSection === 'Cuenta' && (
            <div className="space-y-8 bg-gray-800">
              <h3 className="text-3xl text-white font-semibold mb-6">Cuenta</h3>
              
              <ul className="space-y-6 text-white bg-gray-800">
                {/* Sección Perfil */}
                <li className="hover:bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium hover:text-blue-500 transition"
                    onClick={() => handleToggle('perfil')}
                  >
                    <span>Perfil</span>
                  </button>
                  
                  {expandedItem === 'perfil' || userData ? (
                    <div className="pl-6 flex items-center space-x-8" >
                      {/* Datos del perfil */}
                      <div className="flex-1 text-sm space-y-2">
                        <p><strong>Nombre:</strong> {userData?.firstName || "Desconocido"}</p>
                        <p><strong>Apellidos:</strong> {userData?.lastName || "Desconocido"}</p>
                        <p><strong>Email:</strong> {userData?.email || "Desconocido"}</p>
                        <p><strong>Teléfono:</strong> {userData?.phone || "Desconocido"}</p>
                        <p><strong>Rol:</strong> {userData?.jobTitle || "Desconocido"}</p>
                      </div>

                      {/* Foto de perfil */}
                      <div className="w-28 h-28 flex-shrink-0">
                        {userData?.profilePicture ? (
                          <img
                            src={userData.profilePicture}
                            alt="Foto de perfil"
                            className="w-full h-full object-cover rounded-full border-2 border-gray-600 shadow-md"
                          />
                        ) : (
                          <div className="w-full h-full flex justify-center items-center bg-gray-600 rounded-full text-white text-sm">
                            No foto
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Cargando perfil...</p>
                  )}
                </li>

                {/* Sección Modificar Datos */}
                <li className="hover:bg-gray-800 bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium hover:text-blue-500 transition"
                    onClick={() => handleToggle('modificarDatos')}
                  >
                    <span>Modificar Datos</span>
                  </button>

                  {expandedItem === 'modificarDatos' && (
                    <div className="p-6 bg-gray-900 rounded-xl shadow-lg mt-8 border border-gray-700">
                      <div className="space-y-6">
                        {/* Campos de entrada */}
                        {['Nombre de usuario', 'Nombre', 'Apellido', 'Teléfono'].map((label, idx) => {
                          const value =
                            label === 'Nombre de usuario'
                              ? userName || userData?.userName || ''
                              : label === 'Nombre'
                              ? firstName || userData?.firstName || ''
                              : label === 'Apellido'
                              ? lastName || userData?.lastName || ''
                              : phone || userData?.phone || '';

                          const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = e.target.value;
                            if (label === 'Nombre de usuario') setUserName(val);
                            if (label === 'Nombre') setFirstName(val);
                            if (label === 'Apellido') setLastName(val);
                            if (label === 'Teléfono') setPhone(val);
                          };

                          return (
                            <div key={idx}>
                              <label className="block text-gray-300 mb-2">{label}:</label>
                              <input
                                type="text"
                                className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={value}
                                onChange={onChange}
                              />
                            </div>
                          );
                        })}

                        {/* Nueva imagen de perfil */}
                        <div>
                          <label className="block text-gray-300 mb-2">Nueva imagen de perfil:</label>
                          <input
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setNewProfileImage(e.target.files[0]);
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === "string") {
                                    setPreviewImage(reader.result);
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                            className="text-white"
                          />

                          {previewImage && (
                            <div className="mt-4">
                              <p className="text-gray-400 text-sm mb-1">Previsualización:</p>
                              <img
                                src={previewImage}
                                alt="Previsualización"
                                className="w-32 h-32 object-cover rounded-full border-2 border-gray-600 transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          )}
                        </div>

                        <button
                          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-md transition duration-300"
                          onClick={updateUserData}
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  )}

                </li>

                {/* Sección Modificar Contraseña */}
                <li className="hover:bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium hover:text-blue-500 transition"
                    onClick={() => handleToggle('modificarContraseña')}
                  >
                    <span>Modificar Contraseña</span>
                  </button>
                  
                  {expandedItem === 'modificarContraseña' && (
                    <div className="pl-6">
                      <ChangePasswordForm />
                    </div>
                  )}
                </li>

                {/* Sección Eliminar Cuenta */}
                <li className="hover:bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium text-red-500 hover:text-red-400 transition"
                    onClick={() => handleToggle('eliminarCuenta')}
                  >
                    <span>Eliminar Cuenta</span>
                  </button>
                  
                  {expandedItem === 'eliminarCuenta' && (
                    <div className="pl-6 pt-6 pb-6 text-red-400 bg-gray-800 rounded-md">
                      <p className="text-lg font-semibold mb-4">
                        ¡Esta acción eliminará tu cuenta permanentemente!
                      </p>
                      <DeleteAccountButton />
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}


        {activeSection === 'Pantalla' && (
          <div className="space-y-6">
            <h3 className="text-2xl text-white font-semibold mb-4">Pantalla</h3>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={toggleTheme}>Toggle Theme</button>
          </div>
        )}        
        </div>

      </div>
    </Modal>


    </div>
  );
};

export default Dashboard;
