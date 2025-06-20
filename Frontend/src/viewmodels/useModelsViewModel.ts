import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ModelsDAO } from "../data/dao/ModelsDAO";
import { ModelData } from "../models/AiModels";

export const useModelsViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [models, setModels] = useState<ModelData[]>([]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "es",
  );
  const [scale, setScale] = useState<number>(
    parseFloat(localStorage.getItem("uiScale") || "1"),
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true",
  );

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserAndModels = async () => {
      try {
        const currentUser: any = await ModelsDAO.getCurrentUser();
        setUser(currentUser);

        if (currentUser?.uid) {
          const data = await ModelsDAO.getUserData(currentUser.uid);
          setUserData(data);
        }

        const modelList = await ModelsDAO.listModels();
        setModels(modelList);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar modelos o datos del usuario.");
      }
    };

    loadUserAndModels();
  }, []);

  return {
    user,
    userData,
    models,
    isProfileOpen,
    setIsProfileOpen,
    showAssistant,
    setShowAssistant,
    hoveredModelId,
    setHoveredModelId,
    isSettingsOpen,
    setIsSettingsOpen,
    theme,
    setTheme,
    language,
    setLanguage,
    scale,
    setScale,
    highContrast,
    setHighContrast,
    navigate,
  };
};
