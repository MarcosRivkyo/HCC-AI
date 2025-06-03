import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

import { db } from "../../config/firebase.ts";
import Logout from "../Auth/Logout.tsx";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import logo_user from "../../assets/images/logo_user.png";

import { FaSignInAlt, FaUserPlus, FaChevronDown } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const auth = getAuth();
  const db = getFirestore();

  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string>("home");
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [t, i18next] = useTranslation("global");

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSelectedSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.6,
      },
    );

    const sectionIds = ["home", "objectives", "services", "technology"];
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  const scrollToSection = (id: string) => {
    setSelectedSection(id);
    const target = document.getElementById(id);
    if (!target) return;

    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const ease = easeInOutCubic(Math.min(progress / duration, 1));
      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <nav className="bg-black p-6 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
      {/* Menú de secciones */}
      <ul className="flex space-x-4 text-sm">
        {[
          { id: "home", label: t("navbar.home") },
          { id: "objectives", label: t("navbar.objective") },
          { id: "services", label: t("navbar.services") },
          { id: "technology", label: t("navbar.technologies") },
        ].map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`ml-20 transition-all duration-200 ${
                selectedSection === item.id
                  ? "text-red-400 font-bold"
                  : "hover:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
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
      <div className="ml-auto flex space-x-8">
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
                  onClick={() => navigate("/dashboard")}
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
    </nav>
  );
};

export default Navbar;
