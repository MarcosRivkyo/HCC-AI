import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase.ts";
import { v4 as uuidv4 } from "uuid";
import Logout from "../Auth/Logout.tsx";
import Assistant from "./AssistantView.tsx";
import usePreventZoom from "../UI/usePreventZoom.tsx";
import Modal from "../UI/Modal.tsx";
import DeleteAccountButton from "../UI/DeleteAccountButton.tsx";
import EstudiosRecientes from "../UI/RecentStudies.tsx";
import ChangePasswordForm from "../UI/ChangePasswordForm.tsx";
import ModelosDisponibles from "../UI/AvailableModels.tsx";
import ImageCarrousel from "../UI/ImageCarrousel.tsx";
import { FaFilePdf } from "react-icons/fa";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import settingsIcon from "../../assets/images/settings_icon.png";
import logo_user from "../../assets/images/logo_user.png";
import UsefulLinks from "../UI/UsefulLinks.tsx";
import { useTranslation } from "react-i18next";

import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Timestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NavbarSecond from "../UI/InsideNavbar.tsx";
import ProfileModal from "../UI/ProfileModal.tsx";
import SettingsModal from "../UI/SettingsModal.tsx";
import Footer from "../UI/InsideFooter.tsx";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showAssistant, setShowAssistant] = useState(false);

  const [activeSection, setActiveSection] = useState("Cuenta");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "es",
  );
  const [scale, setScale] = useState<number>(
    parseFloat(localStorage.getItem("uiScale") || "1"),
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true",
  );
  const { t, i18n } = useTranslation("global");

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => setMostrarFormulario(false);

  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newUploadImage, setNewUploadImage] = useState<File | null>(null);
  const [claveEstudios, setClaveEstudios] = useState(Date.now());

  const actualizarEstudios = () => {
    setClaveEstudios(Date.now());
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    localStorage.setItem("uiScale", newScale.toString());
  };

  const [formData, setFormData] = useState({
    studieName: "",
    status: "En Progreso",
    studieDate: "",
    patientName: "",
    doctorName: "",
    doctorId: user?.uid || "",
    clinicalDescription: "",
  });

  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
  };

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  usePreventZoom(true, true);

  useEffect(() => {
    // Tema
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Escala
    document.documentElement.style.setProperty("zoom", scale.toString());
    localStorage.setItem("uiScale", scale.toString());
  }, [scale]);

  useEffect(() => {
    // Idioma
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    // Contraste alto
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
    localStorage.setItem("highContrast", String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "hcc_ai_users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userDocData = userDoc.data();
          setUserData(userDocData);
        } else {
          console.log("No se encontró el documento del usuario.");
        }
      }
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
    }

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    console.log("cambiar modo pantalla:", userData);
  };

  const handleToggle = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const updateUserData = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      let photoURL = userData?.profilePicture;

      const userId = user.uid;
      const folderPath = userData.imageFolder || `HCC-AI/users/${userId}`;

      if (newProfileImage) {
        const storageRef = ref(
          storage,
          `${folderPath}/profile_pictures/${user.uid}`,
        );

        await uploadBytes(storageRef, newProfileImage);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: userName,
        photoURL: photoURL,
      });

      await updateDoc(doc(db, "hcc_ai_users", user.uid), {
        firstName,
        lastName,
        phone,
        profilePicture: photoURL,
        email: user.email,
      });

      setUserData((prev: typeof userData) => ({
        ...prev,
        firstName,
        lastName,
        phone,
        profilePicture: photoURL,
      }));

      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Hubo un error al guardar los cambios");
    } finally {
      setIsSaving(false);
      setNewProfileImage(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const existingQuery = query(
          collection(db, "hcc_ai_studies"),
          where("studieName", "==", formData.studieName),
          where("doctorId", "==", user.uid),
        );

        const existingSnapshot = await getDocs(existingQuery);

        if (!existingSnapshot.empty) {
          toast.warning(
            "Ya existe un estudio con ese nombre. Elige otro nombre.",
          );
          return;
        }

        const today = new Date();
        const selectedDate = new Date(formData.studieDate);

        const isToday = today.toDateString() === selectedDate.toDateString();

        const finalDate = new Date(selectedDate);
        if (!isToday) {
          finalDate.setHours(0, 0, 0, 0);
        } else {
          finalDate.setHours(
            today.getHours(),
            today.getMinutes(),
            today.getSeconds(),
            today.getMilliseconds(),
          );
        }

        const studieDateTimestamp = Timestamp.fromDate(finalDate);

        await addDoc(collection(db, "hcc_ai_studies"), {
          studieName: formData.studieName,
          status: formData.status,
          studieDate: studieDateTimestamp,
          patientName: formData.patientName,
          doctorName: userData?.firstName || user?.displayName || user?.email,
          doctorId: user?.uid || "",
          clinicalDescription: formData.clinicalDescription,
        });

        setFormData({
          studieName: "",
          status: "En Progreso",
          studieDate: "",
          patientName: "",
          doctorName: "",
          doctorId: user?.uid || "",
          clinicalDescription: "",
        });

        cerrarFormulario();

        toast.success("Estudio creado correctamente");
        actualizarEstudios();
      } catch (error) {
        console.error("Error al crear el estudio: ", error);
        toast.error("Hubo un error al crear el estudio");
      }
    } else {
      console.log("El usuario no está autenticado.");
      toast.error("Debes de estar autenticado para crear un estudio");
    }
  };

  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  const handleImageSelect = (url: string) => {
    setSelectedImageUrl(url);
    console.log("Imagen seleccionada:", url);
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

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
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

        {}
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

  return (
    <div
      className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      <NavbarSecond
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAssistantClick={() => setShowAssistant(!showAssistant)}
        isPatientView={false}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
        user={user}
      />

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        scale={scale}
        setScale={setScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        userData={userData}
      />

      <div
        className={`flex-1 flex-col h-screen pt-24 px-6 bg-gray-300 text-black dark:bg-gray-800 dark:text-white`}
      >
        <div
          className={`flex pt-10 pb-10  px-6 h-full bg-gray-300 text-black dark:bg-gray-800 dark:text-white`}
        >
          {/* Panel del asistente con botón dentro */}
          <div className="relative z-50">
            <div
              className={`fixed top-20 bottom-10 right-0 w-[30rem] bg-gray-800 text-white shadow-lg rounded-l-2xl p-4 transition-all duration-500 ease-in-out ${
                showAssistant ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold p-4 border-b border-gray-700">
                  🧠 {t("assistant.title")}
                </h2>
                <button
                  onClick={() => setShowAssistant(false)}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-md"
                  title="Cerrar"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <Assistant />
            </div>

            {/* Botón de abrir, que aparece cuando el asistente está cerrado */}
            {!showAssistant && (
              <button
                onClick={() => setShowAssistant(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition-all duration-300 ease-in-out"
                title="Abrir asistente"
              >
                <ChatBubbleLeftIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="w-1/2 h-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700 mr-6 flex flex-col space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("dashboard.recent_studies")}
              </h2>
              <main className="flex-1 overflow-auto">
                <EstudiosRecientes key={claveEstudios} />
              </main>
            </div>

            {user && (
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-4">
                <UsefulLinks userId={user.uid} />
              </div>
            )}
          </div>

          {}
          <div className="w-1/2 h-full flex flex-col gap-6">
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("dashboard.image_editor")}
              </h2>
              <div className="w-full h-full">
                {/* Carrousel de imágenes */}
                <ImageCarrousel onImageSelect={handleImageSelect} />
              </div>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("dashboard.available_models")}
              </h2>
              <main className="flex-1 overflow-auto">
                <ModelosDisponibles />
              </main>
            </div>
          </div>
        </div>

        {}
      </div> 
      
      <Footer />

    </div>
  );
};

export default Dashboard;
