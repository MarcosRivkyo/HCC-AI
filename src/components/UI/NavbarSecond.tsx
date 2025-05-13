// NavbarSecond.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import logo_user from "../../assets/images/logo_user.png";
import Logout from "../Auth/Logout.tsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type NavbarSecondProps = {
  userData?: any;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onAssistantClick: () => void;
};

const Clock = () => {
  const [time, setTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tileClassName = ({ date }: any) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return "bg-red-500 text-white";
    }
    return "";
  };

  return (
    <div className="relative">
      <div
        className="text-2xl text-gray-200 font-mono mr-4 tracking-wider cursor-pointer"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      >
        {time}
      </div>
      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute top-full right-0 mt-2 p-4 bg-gray-800 rounded-lg shadow-lg w-72 z-50"
        >
          <Calendar
            tileClassName={tileClassName}
            className="bg-gray-900 text-white border-none"
          />
        </div>
      )}
    </div>
  );
};

const NavbarSecond: React.FC<NavbarSecondProps> = ({
  userData,
  onProfileClick,
  onSettingsClick,
  onAssistantClick,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>(
    window.location.pathname,
  );

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  return (
    <nav className="bg-black p-4 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
      <ul className="flex items-center space-x-14 text-sm">
        {[
          { path: "/dashboard", label: "INICIO" },
          { path: "/my-studies", label: "MIS ESTUDIOS" },
          { path: "/models", label: "MODELOS" },
        ].map((item, index) => (
          <li key={item.path} className={index === 0 ? "ml-8" : ""}>
            <button
              onClick={() => {
                navigate(item.path);
                setActivePath(item.path);
              }}
              className={`py-2 ${
                activePath === item.path
                  ? "text-red-500 font-bold"
                  : "hover:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => {
              onAssistantClick();
              setActivePath("/assistant");
            }}
            className={`py-2 ${
              activePath === "/assistant"
                ? "text-red-500 font-bold"
                : "hover:text-gray-300"
            }`}
          >
            ASISTENTE
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              navigate("/predict");
              setActivePath("/predict");
            }}
            className={`font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${
              activePath === "/predict"
                ? "bg-red-700 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            ANALIZAR
          </button>
        </li>
      </ul>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img
          src={logoHCC_AI}
          className="w-32 max-w-full rounded-md cursor-pointer"
          alt="HCC-AI Logo"
          onClick={() => {
            navigate("/dashboard");
            setActivePath("/dashboard");
          }}
        />
      </div>

      <div className="flex items-center gap-4 relative w-72 justify-end">
        <Clock />

        <div
          className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-800 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={user?.photoURL || userData?.profilePicture || logo_user}
            alt="Perfil"
            className="w-10 h-10 max-w-full rounded-full"
          />
          <span className="font-semibold truncate">
            {user?.displayName ||
              userData?.userName ||
              (userData?.firstName || userData?.lastName
                ? `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim()
                : user?.email || "Usuario")}
          </span>
        </div>

        {isOpen && (
          <div
            className="absolute top-full right-0 bg-gray-800 w-48 rounded-lg shadow-lg overflow-hidden mt-2"
            style={{ zIndex: 3000 }}
          >
            <button
              onClick={() => onProfileClick()}
              className="block px-4 py-3 w-full text-left hover:bg-gray-700"
            >
              👤 Ver Perfil
            </button>
            <button
              onClick={() => {
                onSettingsClick();
              }}
              className="block px-4 py-3 w-full text-left hover:bg-gray-700"
            >
              ⚙️ Configuración
            </button>

            <Logout />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarSecond;
