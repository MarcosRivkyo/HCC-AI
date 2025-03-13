import { useState, useEffect } from "react"; 
import { Outlet, useNavigate } from "react-router-dom"; 
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import Logout from "./components/Auth/Logout"; 
import logoHCC_AI from "./assets/images/logo_hcc_ai.jpg"; 
import logo_user from "./assets/images/logo_user.png"; 
import ImageUpload from "./ImageUpload"; 
import Assistant from "./components/Pages/Assistant"; 
import Modal from "./components/UI/Modal"; 

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Estado para el tema

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "hcc_ai_users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    });

    // Aplicar el tema guardado en el localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }

    return () => unsubscribe();
  }, [auth, db]);

  // Cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);  // Guardar tema en localStorage
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Navbar */}
      <nav className="bg-black p-6 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
        <ul className="flex space-x-4 text-sm">
          {[{ path: "/", label: "INICIO" }, { path: "/reports", label: "REPORTES" }].map((item) => (
            <li key={item.path}>
              <button onClick={() => navigate(item.path)} className="ml-6 hover:text-gray-300">
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button onClick={() => setShowAnalysis(!showAnalysis)} className="ml-6 hover:text-gray-300">
              ANALIZAR
            </button>
            <button onClick={() => setShowAssistant(!showAssistant)} className="ml-6 hover:text-gray-300">
              ASISTENTE
            </button>
          </li>
        </ul>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logoHCC_AI} className="w-40 rounded-md cursor-pointer" alt="HCC-AI Logo" onClick={() => navigate("/")} />
        </div>

        <div className="relative">
          <div className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
            <img src={logo_user} alt="Perfil" className="w-10 h-10 rounded-full" />
            <span className="font-semibold">{userData ? `${userData.firstName} ${userData.lastName}` : user?.displayName || user?.email || "Usuario"}</span>
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 bg-gray-800 w-48 rounded-lg shadow-lg overflow-hidden mt-2">
              <button onClick={() => { setIsProfileOpen(true);}} className="block px-4 py-3 w-full text-left hover:bg-gray-700"> 👤 Ver Perfil </button>              
              <button onClick={() => { setIsSettingsOpen(true);}} className="block px-4 py-3 w-full text-left hover:bg-gray-700">⚙️ Configuración</button>
              <Logout />
            </div>
          )}

          <Modal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} size="small">
            <h2 className="text-xl font-semibold mb-4 text-white">Perfil de Usuario</h2>
            <img src={logo_user} alt="Perfil" className="w-20 h-20 rounded-full mx-auto" />
            <p className="mt-2 text-center font-semibold text-white">
              {userData ? `${userData.firstName} ${userData.lastName}` : user?.displayName || user?.email}
            </p>
            <p className="text-gray-500 text-center">{userData?.email || user?.email}</p>
            <p className="mt-2 text-gray-400 text-sm"> 📅 Registrado el: {userData?.createdAt ? userData.createdAt.toDate().toLocaleString() : "Fecha no disponible"}</p>                
            <p className="mt-2 text-gray-400 text-sm"> ☎️ Teléfono: {userData?.phone || "Teléfono no disponible"}</p>
          </Modal>

          {/* Modal de Configuración */}
          <Modal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} size="large">
            <h2 className="text-xl font-semibold mb-4 text-white">Configuración</h2>
            <label className="block text-white mb-4">Cambiar tema</label>
            <button 
              onClick={toggleTheme} 
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            </button>
          </Modal>

        </div>
      </nav>

      {/* Contenedor principal */}
      <div className="flex flex-1 pt-24">
        <main className="flex-1 p-6 overflow-auto">
          {showAnalysis ? <ImageUpload /> : <Outlet />}
          {showAssistant ? <Assistant /> : <Outlet />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center p-4 fixed bottom-0 w-full">
        © 2025 HCC-AI - Todos los derechos reservados
      </footer>
    </div>
  );
};

export default Dashboard;
