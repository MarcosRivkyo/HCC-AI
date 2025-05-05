// NavbarSecond.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { app } from '../../config/firebase';
import logoHCC_AI from '../../assets/images/logo_hcc_ai.jpg';
import logo_user from '../../assets/images/logo_user.png';
import Logout from '../Auth/Logout.tsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect, useRef } from "react";

type NavbarProps = {
    userData?: any;
    onProfileClick: () => void;
    onAssistantClick: () => void;
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


  

const NavbarSecond: React.FC<NavbarProps> = ({ userData , onProfileClick, onAssistantClick}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);  // Mueve esta línea aquí
  const toggleAssistant = () => {  // Mueve esta función aquí
    setShowAssistant(!showAssistant);
  };

  React.useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  return (

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
            onClick={onAssistantClick}
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
            <button onClick={() => onProfileClick()} className="block px-4 py-3 w-full text-left hover:bg-gray-700">👤 Ver Perfil</button>
            <button onClick={() => setIsSettingsOpen(true)} className="block px-4 py-3 w-full text-left hover:bg-gray-700">⚙️ Configuración</button>
            <Logout />
          </div>
        )}
      </div>
    </nav>

  );
};

export default NavbarSecond;
