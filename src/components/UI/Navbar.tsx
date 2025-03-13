import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";




import Logout from "../../components/Auth/Logout.tsx";


import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";

import logo_user from "../../assets/images/logo_user.png";


import { FaSignInAlt, FaUserPlus } from "react-icons/fa";


const Navbar: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const auth = getAuth();
    const db = getFirestore();
  
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState<string>("home");
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
  
    const [ t, i18next ] = useTranslation("global");
  
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
  
  
  
    const scrollToSection = (id: string) => {
      setSelectedSection(id);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
  
    return (
      <nav className="bg-black p-6 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
        <ul className="flex space-x-4 text-sm">
          {[{ id: "home", label: t("navbar.home") }, { id: "objectives", label: t("navbar.objective") }, { id: "services", label: t("navbar.services") }, { id: "technology", label: t("navbar.technologies") }].map(item => (
            <li key={item.id}>
              <button onClick={() => scrollToSection(item.id)} className={`ml-20 transition-all duration-200 ${selectedSection === item.id ? "text-red-400 font-bold" : "hover:text-gray-300"}`}>{item.label}</button>
            </li>
          ))}
        </ul>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logoHCC_AI} className="w-32 rounded-md cursor-pointer" alt="HCC-AI Logo" onClick={() => scrollToSection("home")} />
        </div>
  
  
        
  
  
        <div className="ml-auto flex space-x-8">
          {user ? (
            <div className="relative">
  
            <div className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
              <img src={logo_user || user?.photoURL} alt="Perfil" className="w-10 h-10 rounded-full" />
              <span className="font-semibold">{userData ? `${userData.firstName} ${userData.lastName}` : user?.displayName || user?.email || "Usuario"}</span>
            </div>
  
            {isOpen && (
              <div className="absolute top-full left-0 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-2">
                <button onClick={() => navigate("/dashboard")} className="block px-4 py-3 w-full text-left hover:bg-gray-700">
                  👤 {t("navbar.access")}
                </button>
                <Logout />
              </div>
            )}
          </div>
          ) : (
            <>
              {/* Botón Login */}
              <div className="relative inline-flex group">
                <div
                  className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:-duration-200 animate-tilt"
                ></div>
                <a
                  href="#"
                  title="Login"
                  onClick={() => navigate('/login')}
                  className="relative inline-flex items-center justify-center px-6 py-2 text-md font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  role="button"
                >
                  <FaSignInAlt className="mr-2" /> {/* Icono para el botón Login */}
                  {t("navbar.login")}
                </a>
              </div>
  
  
              {/* Botón Signup */}
              <div className="relative inline-flex group">
              <div
                className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:-duration-200 animate-tilt"
              ></div>
              <a
                href="#"
                title="Signup"
                onClick={() => navigate('/signup')}
                className="relative inline-flex items-center justify-center px-6 py-2 text-md font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                <FaUserPlus className="mr-2" /> {/* Icono para el botón Signup */}
                {t("navbar.register")}
              </a>
              </div>
  
  
            </>
          )}
        </div>
      </nav>
    );
  };


  export default Navbar;