// src/views/Components/InsideNavbar.tsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavbarSecondViewModel } from "../../viewmodels/useInsideNavbarViewModel.ts";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import logo_user from "../../assets/images/logo_user.png";
import Logout from "../Auth/Logout.tsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import {
  FiHome,
  FiBook,
  FiCpu,
  FiFolder,
  FiCalendar,
  FiChevronRight,
} from "react-icons/fi";
import { FaChevronDown, FaUserCircle, FaCog } from "react-icons/fa";
import "../../calendar-overrides.css";

type NavbarSecondProps = {
  userData?: any;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onAssistantClick: () => void;
  isPatientView: boolean;
};

type Reminder = {
  id: string;
  date: string;
  text: string;
  done: boolean;
};

const db = getFirestore();

const Clock: React.FC<{ reminders: Reminder[] }> = ({ reminders }) => {
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
            className="bg-gray-900 text-white border-none"
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;
              const dateStr = date.toDateString();
              const dayReminders = reminders.filter((r) => r.date === dateStr);
              if (dayReminders.length === 0) return null;
              const allDone = dayReminders.every((r) => r.done);
              return allDone ? "highlight-complete" : "highlight-reminder";
            }}
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
  isPatientView,
}) => {
  const {
    user,
    reminders,
    activePath,
    setActivePath,
    isOpen,
    setIsOpen,
    menuRef,
    navigate,
  } = useNavbarSecondViewModel();

  const { t, i18n } = useTranslation("global");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isPatientView
    ? []
    : [
        { path: "/dashboard", label: t("navbar.home"), icon: <FiHome /> },
        {
          path: "/my-studies",
          label: t("navbar.my_studies"),
          icon: <FiBook />,
        },
        { path: "/models", label: t("navbar.models"), icon: <FiCpu /> },
        { path: "/files", label: t("navbar.files"), icon: <FiFolder /> },
        {
          path: "/calendar",
          label: t("navbar.calendar"),
          icon: <FiCalendar />,
        },
      ];

  return (
    <nav className="bg-black h-20 px-4 text-white flex items-center justify-between fixed w-full top-0 z-50 shadow-lg">
      {!isPatientView && (
        <div className="flex items-center w-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={logoHCC_AI}
              className="w-32 rounded-md cursor-pointer"
              alt="HCC-AI Logo"
              onClick={() => {
                navigate("/dashboard");
                setActivePath("/dashboard");
              }}
            />
          </div>

          {/* Botón de menú para móviles */}
          <div className="lg:hidden ml-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Menú móvil colapsable */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-20 left-0 w-full bg-black border-t border-gray-700 z-40">
              <ul className="flex flex-col p-4 space-y-4 text-sm">
                {navItems.map(({ path, label, icon }) => (
                  <li key={path}>
                    <button
                      onClick={() => {
                        navigate(path);
                        setActivePath(path);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 py-2 px-4 w-full text-left ${
                        activePath === path ? "text-red-500 font-bold" : "text-white hover:text-gray-300"
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      navigate("/predict");
                      setActivePath("/predict");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 py-2 px-4 w-full text-left font-bold rounded-md shadow-md ${
                      activePath === "/predict"
                        ? "bg-red-700 text-white"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black"
                    }`}
                  >
                    <FiChevronRight className="text-xl" />
                    {t("navbar.editor")}
                  </button>
                </li>
              </ul>
            </div>
          )}


          {/* Nav buttons */}
          <div className="hidden lg:flex flex-1 justify-center ml-12">

            <ul className="flex items-center flex-wrap gap-x-12 text-sm">
              {navItems.map(({ path, label, icon }) => (
                <li key={path}>
                  <button
                    onClick={() => {
                      navigate(path);
                      setActivePath(path);
                    }}
                    className={`flex flex-col items-center gap-1 py-2 ${
                      activePath === path
                        ? "text-red-500 font-bold"
                        : "hover:text-gray-300"
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    navigate("/predict");
                    setActivePath("/predict");
                  }}
                  className={`flex flex-col items-center gap-1 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${
                    activePath === "/predict"
                      ? "bg-red-700 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }`}
                >
                  <FiChevronRight className="text-xl" />
                  <span>{t("navbar.editor")}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* CENTERED LOGO (only for patients) */}
      {isPatientView && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src={logoHCC_AI}
            className="w-32 rounded-md cursor-pointer"
            alt="HCC-AI Logo"
            onClick={() => {
              navigate("/dashboard-patient");
              setActivePath("/dashboard-patient");
            }}
          />
        </div>
      )}

      {/* RIGHT SIDE: Clock + Profile */}
      <div className="ml-auto flex items-center gap-4" ref={menuRef}>
        <div className="hidden lg:block">
          <Clock reminders={reminders} />
        </div>
        <div
          className={`inline-flex items-center gap-3 px-3 py-2 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-xl transition duration-300 shadow-md ${
            isOpen ? "ring-2 ring-pink-500" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-3 ">
            <img
              src={userData?.profilePicture || user?.photoURL || logo_user}
              alt="Perfil"
              className="w-10 h-10 rounded-full border border-white"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold whitespace-nowrap">
                {user?.displayName ||
                  userData?.userName ||
                  (userData?.firstName || userData?.lastName
                    ? `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim()
                    : user?.email || "Usuario")}
              </span>
              {userData?.rol && (
                <span className="text-sm italic text-gray-400 mt-0.5">
                  {t(`roles.${userData.rol}`)}
                </span>
              )}
            </div>
          </div>
          <FaChevronDown
            className={`text-sm ml-10 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full right-0 bg-gray-800 w-48 rounded-xl shadow-xl mt-2 border border-gray-700 transition-all duration-300 ease-out animate-fade-in">
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-gray-700 transition duration-200"
            >
              <FaUserCircle className="text-lg" />
              {t("navbar.view_profile")}
            </button>
            <button
              onClick={onSettingsClick}
              className="flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-gray-700 transition duration-200"
            >
              <FaCog className="text-lg" />
              {t("navbar.settings")}
            </button>
            <Logout />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarSecond;
