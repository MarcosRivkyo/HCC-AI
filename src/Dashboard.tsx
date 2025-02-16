import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Importa los métodos para obtener datos de Firestore
import Logout from "./Logout";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null); // Estado para almacenar los datos del usuario

  const auth = getAuth();
  const db = getFirestore();

  // Obtener usuario autenticado y los datos de Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Obtener los datos del usuario desde Firestore usando su UID
        const userDocRef = doc(db, "hcc_ai_users", currentUser.uid); // Referencia al documento del usuario
        const userDoc = await getDoc(userDocRef); // Obtener el documento

        if (userDoc.exists()) {
          setUserData(userDoc.data()); // Almacenar los datos en el estado
        }
      }
    });

    return () => unsubscribe(); // Limpiar la suscripción cuando el componente se desmonte
  }, []);

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col justify-between p-6">
      {/* Navegación */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">HCC-AI</h2>
        <ul>
          <li className="mb-4">
            <Link to="/upload" className="block p-3 rounded bg-blue-600">📂 Cargar Imagen</Link>
          </li>
          <li className="mb-4">
            <Link to="/analysis" className="block p-3 rounded bg-gray-800 hover:bg-gray-700">🩻 Análisis</Link>
          </li>
          <li className="mb-4">
            <Link to="/reports" className="block p-3 rounded bg-gray-800 hover:bg-gray-700">📊 Reportes</Link>
          </li>
          <li>
            <Link to="/settings" className="block p-3 rounded bg-gray-800 hover:bg-gray-700">⚙️ Configuración</Link>
          </li>
        </ul>
      </div>

      {/* Perfil de Usuario */}
      <div className="relative">
        <div
          className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={user?.photoURL || "https://i.pravatar.cc/50"} // Foto de perfil del usuario
            alt="Perfil"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-white font-semibold">
            {userData ? `${userData.firstName} ${userData.lastName}` : user?.displayName || user?.email || "Usuario"}
          </span>
        </div>

        {/* Menú desplegable */}
        {isOpen && (
          <div className="absolute bottom-14 left-0 bg-gray-800 w-48 rounded-lg shadow-lg overflow-hidden">
            <Link to="/profile" className="block px-4 py-3 hover:bg-gray-700">👤 Ver Perfil</Link>
            <Link to="/settings" className="block px-4 py-3 hover:bg-gray-700">⚙️ Configuración</Link>
            <Logout />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
