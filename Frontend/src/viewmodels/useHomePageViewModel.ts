// src/viewmodels/useHomePageViewModel.ts

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserDAO } from "../data/dao/UserDAO";
import { AuthDAO } from "../data/dao/AuthDAO";

export const useHomePageViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light",
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "es",
  );
  const [scale, setScale] = useState<number>(
    parseFloat(localStorage.getItem("uiScale") || "1"),
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true",
  );

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
    const unsubscribe = AuthDAO.subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const data = await UserDAO.getUserById(currentUser.uid);
          setUserData(data);
          setFormData((prev) => ({
            ...prev,
            doctorId: currentUser.uid,
            doctorName:
              data?.firstName || currentUser.displayName || currentUser.email,
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("No se pudieron cargar los datos del usuario.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
    localStorage.setItem("uiScale", scale.toString());
  }, [scale]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
    localStorage.setItem("highContrast", String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleImageSelect = (url: string) => {
    setSelectedImageUrl(url);
  };

  return {
    user,
    userData,
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
  };
};
