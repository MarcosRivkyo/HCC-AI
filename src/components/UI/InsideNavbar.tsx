import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase.ts";
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
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "../../calendar-overrides.css";
import { FaChevronDown, FaUserCircle, FaCog } from "react-icons/fa";

type NavbarSecondProps = {
  userData?: any;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onAssistantClick: () => void;
};

const db = getFirestore();

type Reminder = {
  id: string;
  date: string;
  text: string;
  done: boolean;
};

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
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activePath, setActivePath] = useState<string>(
    window.location.pathname,
  );
  const { t, i18n } = useTranslation("global");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const snapshot = await getDocs(
        collection(db, "hcc_ai_users", currentUser.uid, "reminders"),
      );

      const loadedReminders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        done: doc.data().done ?? false,
      })) as Reminder[];

      setReminders(loadedReminders);
    };

    fetchReminders();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  useEffect(() => {
    const handleLangChange = () => setActivePath((p) => p);
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navItems = [
    { path: "/dashboard", label: t("navbar.home"), icon: <FiHome /> },
    { path: "/my-studies", label: t("navbar.my_studies"), icon: <FiBook /> },
    { path: "/models", label: t("navbar.models"), icon: <FiCpu /> },
    { path: "/files", label: t("navbar.files"), icon: <FiFolder /> },
    { path: "/calendar", label: t("navbar.calendar"), icon: <FiCalendar /> },
  ];

  return (
    <nav className="bg-black p-4 text-white flex flex-wrap items-center justify-between gap-y-4 fixed w-full top-0 z-50 shadow-lg">
      <div className="flex items-center flex-shrink-0">
        <img
          src={logoHCC_AI}
          className="w-32 max-w-full rounded-md cursor-pointer"
          alt="HCC-AI Logo"
          onClick={() => {
            navigate("/");
            setActivePath("/");
          }}
        />
      </div>

      <ul className="flex items-center text-sm space-x-8 sm:space-x-12 md:space-x-16">
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

      <div
        className="flex items-center gap-4 relative justify-end"
        ref={menuRef}
      >
        <Clock reminders={reminders} />

        <div
          className={`inline-flex items-center gap-3 px-3 py-2 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-xl transition duration-300 shadow-md ${
            isOpen ? "ring-2 ring-pink-500" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={userData?.profilePicture || user?.photoURL || logo_user}
              alt="Perfil"
              className="w-10 h-10 rounded-full border border-white"
            />
            <span className="font-semibold whitespace-nowrap">
              {user?.displayName ||
                userData?.userName ||
                (userData?.firstName || userData?.lastName
                  ? `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim()
                  : user?.email || "Usuario")}
            </span>
          </div>

          <FaChevronDown
            className={`text-sm ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>


        {isOpen && (
          <div
            className="absolute top-full right-0 bg-gray-800 w-48 rounded-xl shadow-xl mt-2 border border-gray-700 transition-all duration-300 ease-out animate-fade-in"
            style={{ zIndex: 3000 }}
          >

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
