import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Logout from "./Logout";
import logoHCC_AI from "./assets/logo_hcc_ai.jpg";
import ImageUpload from "./ImageUpload";


const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

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

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-black p-6 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
        <ul className="flex space-x-4 text-sm">
          {[{ path: "/", label: "INICIO" }, { path: "/analysis", label: "ANÁLISIS" }, { path: "/reports", label: "REPORTES" }, { path: "/settings", label: "CONFIGURACIÓN" }].map((item) => (
            <li key={item.path}>
              <button onClick={() => navigate(item.path)} className="ml-6 hover:text-gray-300">
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logoHCC_AI} className="w-40 rounded-md cursor-pointer" alt="HCC-AI Logo" onClick={() => navigate("/")} />
        </div>

        <div className="relative">
              <div className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
                <img src={user?.photoURL || "https://i.pravatar.cc/50"} alt="Perfil" className="w-10 h-10 rounded-full" />
                <span className="font-semibold">{userData ? `${userData.firstName} ${userData.lastName}` : user?.displayName || user?.email || "Usuario"}</span>
              </div>
              {isOpen && (
                <div className="absolute top-full left-0 bg-gray-800 w-48 rounded-lg shadow-lg overflow-hidden mt-2">
                  <button onClick={() => navigate("/profile")} className="block px-4 py-3 w-full text-left hover:bg-gray-700">👤 Ver Perfil</button>
                  <button onClick={() => navigate("/settings")} className="block px-4 py-3 w-full text-left hover:bg-gray-700">⚙️ Configuración</button>
                  <Logout />
                </div>
              )}
        </div>
      </nav>

      {/* Contenedor principal con Sidebar + Contenido */}
      <div className="flex flex-1 pt-24">
        {/* Sidebar */}
        <div className="w-64 bg-black text-white min-h-screen flex flex-col justify-between p-6">
          <div className="flex flex-col items-center space-y-6">
            <ul className="w-full space-y-4">
              {[{ path: "/upload", label: "📂 Cargar Imagen" }, { path: "/analysis", label: "🩻 Análisis" }, { path: "/reports", label: "📊 Reportes" }, { path: "/settings", label: "⚙️ Configuración" }].map((item) => (
                <li key={item.path}>
                  <button onClick={() => navigate(item.path)} className="block w-full p-3 rounded bg-gray-800 hover:bg-gray-700 text-center transition duration-300 ease-in-out transform hover:scale-105">
                    {item.label}
                  </button>
                  
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contenido Principal */}
        <main className="flex-1 bg-gray-600 p-6 overflow-auto">
          <Outlet />
          <ImageUpload />

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
