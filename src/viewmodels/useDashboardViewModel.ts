// src/viewmodels/useDashboardViewModel.ts
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  fetchUserData,
  updateUserProfile,
  uploadProfileImage,
  updateAuthProfile,
  checkExistingStudy,
  createStudy,
} from "../models/userModel";
import { toast } from "react-toastify";


export const useDashboardViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);


  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(localStorage.getItem("theme") as "light" | "dark" || "light");
  console.log(theme)
  const [language, setLanguage] = useState(localStorage.getItem("language") || "es");
  const [scale, setScale] = useState<number>(parseFloat(localStorage.getItem("uiScale") || "1"));
  const [highContrast, setHighContrast] = useState(localStorage.getItem("highContrast") === "true");

  const [claveEstudios, setClaveEstudios] = useState(Date.now());
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    studieName: "",
    status: "En Progreso",
    studieDate: "",
    patientName: "",
    doctorName: "",
    doctorId: "",
    clinicalDescription: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await fetchUserData(currentUser.uid);
        setUserData(data);
        setFormData((prev) => ({
          ...prev,
          doctorId: currentUser.uid,
          doctorName: data?.firstName || currentUser.displayName || currentUser.email,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
    localStorage.setItem("uiScale", scale.toString());
  }, [scale]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
    localStorage.setItem("highContrast", String(highContrast));
  }, [highContrast]);

  const updateUser = async (info: {
    firstName: string;
    lastName: string;
    phone: string;
    userName: string;
  }) => {
    if (!user) return;

    setIsSaving(true);
    try {
      let photoURL = userData?.profilePicture;
      if (newProfileImage) {
        const path = `HCC-AI/users/${user.uid}/profile_pictures/${user.uid}`;
        photoURL = await uploadProfileImage(newProfileImage, path);
      }

      await updateAuthProfile(user, info.userName, photoURL || "");
      await updateUserProfile(user.uid, {
        firstName: info.firstName,
        lastName: info.lastName,
        phone: info.phone,
        profilePicture: photoURL,
        email: user.email,
      });

      setUserData((prev: any) => ({
        ...prev,
        firstName: info.firstName,
        lastName: info.lastName,
        phone: info.phone,
        profilePicture: photoURL,
      }));

      toast.success("Perfil actualizado");
    } catch (error) {
      toast.error("Error al actualizar perfil");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const createNewStudy = async () => {
    const exists = await checkExistingStudy(formData.studieName, formData.doctorId);
    if (exists) {
      toast.warning("Ya existe un estudio con ese nombre.");
      return;
    }

    await createStudy(formData);
    toast.success("Estudio creado correctamente");

    setFormData({
      studieName: "",
      status: "En Progreso",
      studieDate: "",
      patientName: "",
      doctorName: userData?.firstName || user?.displayName || user?.email,
      doctorId: user?.uid || "",
      clinicalDescription: "",
    });

    setClaveEstudios(Date.now());
  };

  const handleImageSelect = (url: string) => {
    setSelectedImageUrl(url);
    console.log("Imagen seleccionada:", url);
  };

  return {
    // Datos de usuario
    user,
    userData,
    isSaving,
    newProfileImage,
    setNewProfileImage,
    updateUser,

    // Formulario
    formData,
    setFormData,
    createNewStudy,

    // UI state
    isProfileOpen,
    setIsProfileOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    showAssistant,
    setShowAssistant,
    theme,
    setTheme,
    language,
    setLanguage,
    scale,
    setScale,
    highContrast,
    setHighContrast,
    claveEstudios,
    handleImageSelect,
    selectedImageUrl,
  };
};
