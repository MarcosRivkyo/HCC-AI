import { useTranslation } from "react-i18next";
import { useAppNavbarViewModel } from "../../viewmodels/useAppNavbarViewModel";

import {
  FaSignInAlt,
  FaUserPlus,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import Logout from "../Auth/Logout.tsx";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import logo_user from "../../assets/images/logo_user.png";

const Navbar: React.FC = () => {
  const {
    user,
    userData,
    selectedSection,
    isOpen,
    setIsOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    dropdownRef,
    navigate,
    scrollToSection,
  } = useAppNavbarViewModel();

  const [t, i18next] = useTranslation("global");

  return (
    <>
      <nav className="bg-black p-6 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
        {/* Menú de secciones */}
        <ul className="hidden md:flex space-x-4 text-sm">
          {[
            { id: "home", label: t("navbar.home") },
            { id: "objectives", label: t("navbar.objective") },
            { id: "services", label: t("navbar.services") },
            { id: "technology", label: t("navbar.technologies") },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`ml-10 transition-all duration-200 ${
                  selectedSection === item.id
                    ? "text-red-400 font-bold"
                    : "hover:text-gray-300"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}

          {/* DOCUMENTACIÓN como botón de navegación */}
          <li>
            <button
              onClick={() => navigate("/documentation")}
              className={`ml-10 transition-all duration-200 ${
                location.pathname === "/documentation"
                  ? "text-red-400 font-bold"
                  : "hover:text-gray-300"
              }`}
            >
              {t("navbar.documentation")}
            </button>
          </li>          
        </ul>

        {/* Logo central */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src={logoHCC_AI}
            className="w-32 rounded-md cursor-pointer"
            alt="HCC-AI Logo"
            onClick={() => scrollToSection("home")}
          />
        </div>

        {/* Área de login/usuario */}
        <div className="hidden md:flex ml-auto space-x-8">
          {user && user.emailVerified ? (
            <div ref={dropdownRef} className="relative inline-block">
              <div
                className={`inline-flex items-center gap-3 px-4 py-2 cursor-pointer bg-gray-900 hover:bg-gray-700 rounded-xl transition duration-300 shadow-md ${
                  isOpen ? "ring-2 ring-pink-500" : ""
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  src={userData?.profilePicture || user?.photoURL || logo_user}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full border border-white"
                />
                <span className="font-semibold whitespace-nowrap">
                  {user?.displayName ||
                    (userData?.firstName || userData?.lastName
                      ? `${userData.firstName} ${userData.lastName}`
                      : user?.email || "Usuario")}
                </span>
                <FaChevronDown
                  className={`text-sm transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isOpen && (
                <div className="absolute top-full left-0 w-full bg-gray-900 rounded-xl shadow-xl mt-2 border border-gray-700 transition-all duration-300 ease-out animate-fade-in">
                  <button
                    onClick={async () => {

                      navigate("/dashboard");                      
                      try {
                        await Promise.all([
                          fetch(import.meta.env.VITE_BACKEND_URL + "/", { method: "GET" }),
                          fetch(import.meta.env.VITE_AI_BACKEND_URL + "/", { method: "GET" }),
                        ]);
                      } catch (err) {
                      }
                    }}
                    className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-800 transition duration-200"
                  >
                    <FaSignInAlt className="mr-2" />
                    {t("navbar.access")}
                  </button>

                  <Logout />
                </div>
              )}

            </div>
          ) : (
            <>
              {/* Login */}
              <div className="relative inline-flex group">
                <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:-duration-200 animate-tilt"></div>
                <a
                  href="#"
                  onClick={() => navigate("/login")}
                  className="relative inline-flex items-center justify-center px-6 py-2 text-md font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <FaSignInAlt className="mr-2" />
                  {t("navbar.login")}
                </a>
              </div>

              {/* Signup */}
              <div className="relative inline-flex group">
                <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:-duration-200 animate-tilt"></div>
                <a
                  href="#"
                  onClick={() => navigate("/signup")}
                  className="relative inline-flex items-center justify-center px-6 py-2 text-md font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <FaUserPlus className="mr-2" />
                  {t("navbar.register")}
                </a>
              </div>
            </>
          )}
        </div>

        {/* Botón hamburguesa (solo móvil) */}
        <div className="md:hidden z-50">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 bg-gray-900 p-4 rounded-lg shadow-lg">
        {[
          { id: "home", label: t("navbar.home"), type: "scroll" },
          { id: "objectives", label: t("navbar.objective"), type: "scroll" },
          { id: "services", label: t("navbar.services"), type: "scroll" },
          { id: "technology", label: t("navbar.technologies"), type: "scroll" },
          { id: "/documentation", label: t("navbar.documentation"), type: "link" },
        ].map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.type === "scroll") {
                  scrollToSection(item.id);
                } else {
                  navigate(item.id);
                }
                setMobileMenuOpen(false);
                setIsOpen(false);
              }}
              className={`block w-full text-left text-sm ${
                selectedSection === item.id
                  ? "text-red-400 font-bold"
                  : "text-white"
              }`}
            >
              {item.label}
            </button>
          </div>
        ))}


          <div className="border-t border-gray-700 pt-4">
            {user && user.emailVerified ? (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                  className="w-full text-left py-2"
                >
                  {t("navbar.access")}
                </button>
                <Logout />
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full text-left py-2"
                >
                  <FaSignInAlt className="inline mr-2" />
                  {t("navbar.login")}
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsOpen(false);
                  }}
                  className="w-full text-left py-2"
                >
                  <FaUserPlus className="inline mr-2" />
                  {t("navbar.register")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
