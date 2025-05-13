import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../config/firebase";

import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import NavbarSecond from "../UI/NavbarSecond";
import ProfileModal from "../UI/ProfileModal";
import Assistant from "./Assistant";
import SettingsModal from "../UI/SettingsModal";

type ModelData = {
  modelId: string;
  modelName: string;
  modelType: string;
  accuracy: number;
  description: string;
  trainDate: any;
};

const Models = () => {
  const [models, setModels] = useState<ModelData[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
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

  const db = getFirestore(app);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = collection(db, "hcc_ai_users");
        const userDocs = await getDocs(userDocRef);
        const userDoc = userDocs.docs.find((doc) => doc.id === currentUser.uid);
        if (userDoc) setUserData(userDoc.data());
      }
    });
    return () => unsubscribe();
  }, [db]);

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
            "Modelo generativo, optimizado mediante técnicas de prompt engineering, adaptado a la asistencia en la salud hepática.",
          trainDate: null,
        };

        setModels([...data, geminiModel]);
      } catch (error) {
        console.error("Error al obtener modelos:", error);
      }
    };
    fetchModels();
  }, [db]);

  const renderModelCards = (filteredModels: ModelData[]) =>
    filteredModels.length === 0 ? null : (
      <div className="flex flex-col items-center gap-6">
        {filteredModels.map((model, index) => {
          const isGemini = model.modelId === "gemini-1.5-pro";
          const isHovered = hoveredModelId === model.modelId;
          const accuracy = Number(model.accuracy);
          const formattedAccuracy = isNaN(accuracy)
            ? "N/A"
            : `${(accuracy * 100).toFixed(2)}%`;

          return (
            <motion.div
              key={model.modelId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredModelId(model.modelId)}
              onMouseLeave={() => setHoveredModelId(null)}
              className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">
                <span className="text-xs uppercase font-bold text-gray-400">
                  {model.modelType}
                </span>
                <h2 className="text-xl font-bold text-blue-700 mt-1">
                  {model.modelName}
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {model.modelId === "sJNL0uZfOclYDPsLVavU"
                  ? "Clasifica ecografías hepáticas según la escala METAVIR (F0 a F4), que evalúa el grado de fibrosis hepática."
                  : model.description}
              </p>

              {isGemini ? (
                <div className="text-sm text-gray-700 mt-4 space-y-1">
                  <p>
                    <strong>Aplicación:</strong> Asistencia hepática con
                    razonamiento contextual
                  </p>
                  <p>
                    <strong>Optimización:</strong> Prompt Engineering clínico
                  </p>
                  <p>
                    <strong>Proveedor:</strong> Google
                  </p>
                </div>
              ) : (
                <div className="flex justify-between items-center text-sm text-gray-700 mt-4">
                  <div>
                    <p>
                      <strong>Accuracy:</strong>{" "}
                      <span className="text-green-600 font-semibold">
                        {formattedAccuracy}
                      </span>
                    </p>
                    <p>
                      <strong>ID:</strong>{" "}
                      <span className="text-gray-500">{model.modelId}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Entrenado el:</p>
                    <p className="text-sm font-medium">
                      {model.trainDate?.seconds
                        ? new Date(
                            model.trainDate.seconds * 1000,
                          ).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Sin fecha"}
                    </p>
                  </div>
                </div>
              )}

              {isHovered && model.modelId === "sJNL0uZfOclYDPsLVavU" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="mt-6 text-sm text-gray-700 bg-gray-100 rounded-xl p-4 space-y-4"
                >
                  <div>
                    <p className="font-semibold mb-1">
                      Escala METAVIR (F0 - F4):
                    </p>
                    <ul className="text-xs text-gray-600 list-disc pl-4">
                      <li>
                        <strong>F0:</strong> Sin fibrosis
                      </li>
                      <li>
                        <strong>F1:</strong> Fibrosis portal sin septos
                      </li>
                      <li>
                        <strong>F2:</strong> Fibrosis con pocos septos
                      </li>
                      <li>
                        <strong>F3:</strong> Muchos septos sin cirrosis
                      </li>
                      <li>
                        <strong>F4:</strong> Cirrosis
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Submodelos utilizados:</p>
                    <ul className="list-disc pl-5 text-xs text-gray-600">
                      <li>
                        <strong>ResNet:</strong> Extracción de características
                        profundas
                      </li>
                      <li>
                        <strong>VGG:</strong> Detección de patrones fibróticos
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {isHovered && model.modelId === "nbiJGYKysFXTCeONkSvv" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="mt-6 text-sm text-gray-700 bg-gray-100 rounded-xl p-4 space-y-4"
                >
                  <div>
                    <p className="font-semibold mb-1">
                      Estructuras segmentadas:
                    </p>
                    <ul className="text-xs text-gray-600 list-disc pl-4 grid grid-cols-2 gap-y-1">
                      <li>
                        <strong>HCC:</strong> Carcinoma hepatocelular
                      </li>
                      <li>
                        <strong>HV:</strong> Vena hepática
                      </li>
                      <li>
                        <strong>IVC:</strong> Vena cava inferior
                      </li>
                      <li>
                        <strong>K:</strong> Riñón
                      </li>
                      <li>
                        <strong>K-C:</strong> Corteza renal
                      </li>
                      <li>
                        <strong>K-M:</strong> Médula renal
                      </li>
                      <li>
                        <strong>TRANS:</strong> Corte transversal
                      </li>
                      <li>
                        <strong>LVR:</strong> Hígado
                      </li>
                      <li>
                        <strong>PV:</strong> Vena porta
                      </li>
                      <li>
                        <strong>SAG:</strong> Corte sagital
                      </li>
                      <li>
                        <strong>SAG K:</strong> Corte sagital renal
                      </li>
                      <li>
                        <strong>LT SAG:</strong> Lóbulo izquierdo (sagital)
                      </li>
                      <li>
                        <strong>RT TRANS:</strong> Lóbulo derecho (transversal)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Submodelos utilizados:</p>
                    <ul className="list-disc pl-5 text-xs text-gray-600">
                      <li>
                        <strong>YOLOv8:</strong> Segmentación anatómica base
                      </li>
                      <li>
                        <strong>YOLOv11:</strong> Optimización avanzada en
                        estructuras vasculares y tumorales
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    );

  const classificationModels = models.filter(
    (m) => m.modelType.toLowerCase().trim() === "classification",
  );
  const segmentationModels = models.filter(
    (m) => m.modelType.toLowerCase().trim() === "segmentation",
  );
  const generativeModels = models.filter(
    (m) => m.modelType.toLowerCase().trim() === "generative",
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <NavbarSecond
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAssistantClick={() => setShowAssistant(!showAssistant)}
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

      <div className="relative">
        <div
          className={`fixed top-20 bottom-1 right-0 w-1/4 bg-gray-800 text-white p-4 transition-transform transform ${
            showAssistant ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ zIndex: 1000 }}
        >
          <Assistant />
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-20">
        <h1 className="text-4xl mt-8 font-bold text-center text-gray-800 mb-16 flex items-center justify-center gap-2">
          <CubeTransparentIcon className="w-8 h-8 text-blue-500" />
          Modelos de IA Disponibles
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <section className="flex-1">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-blue-300 pb-2 text-center">
              Clasificación
            </h2>
            {renderModelCards(classificationModels)}
          </section>

          <section className="flex-1">
            <h2 className="text-2xl font-semibold text-purple-600 mb-6 border-b border-purple-300 pb-2 text-center">
              Segmentación
            </h2>
            {renderModelCards(segmentationModels)}
          </section>

          <section className="flex-1">
            <h2 className="text-2xl font-semibold text-pink-600 mb-6 border-b border-pink-300 pb-2 text-center">
              Generativos
            </h2>
            {renderModelCards(generativeModels)}
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-white text-center p-4 w-full mt-auto shadow-lg rounded-t-lg mb-0">
        © 2025 HCC-AI
      </footer>
    </div>
  );
};

export default Models;
