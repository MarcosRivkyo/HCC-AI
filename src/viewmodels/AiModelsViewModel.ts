import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { ModelData } from "../models/AiModels";
import { app } from "../config/firebase";

export const useModelsViewModel = () => {
  const db = getFirestore(app);
  const auth = getAuth();
  const { i18n } = useTranslation("global");

  const [models, setModels] = useState<ModelData[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocs = await getDocs(collection(db, "hcc_ai_users"));
        const userDoc = userDocs.docs.find((doc) => doc.id === currentUser.uid);
        if (userDoc) setUserData(userDoc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hcc_ai_models"));
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          modelId: doc.id,
        })) as ModelData[];

        const geminiModel: ModelData = {
          modelId: "gemini-1.5-pro",
          modelName: "Gemini 1.5 Pro",
          modelType: "Generative",
          accuracy: NaN,
          description:
            i18n.language === "fr"
              ? "Modèle génératif avancé de Google pour les tâches multimodales de traitement du langage naturel."
              : i18n.language === "es"
              ? "Modelo generativo avanzado de Google para tareas multimodales de lenguaje natural."
              : "Google's advanced generative model for multimodal natural language tasks.",
          trainDate: null,
        };

        setModels([...data, geminiModel]);
      } catch (error) {
        console.error("Error al obtener modelos:", error);
      }
    };

    fetchModels();
  }, [i18n.language]);

  return {
    models,
    user,
    userData,
  };
};
