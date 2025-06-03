import React, { useRef, useEffect, useState } from "react";
import Toolbox from "../UI/Toolbox.tsx";
import EditorCanvas from "../UI/EditorCanvas.tsx";
import "../../App.css";
import * as fabric from "fabric";
import { Canvas, PencilBrush } from "fabric";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../config/firebase.ts";
import NavbarSecond from "../UI/InsideNavbar.tsx";
import ProfileModal from "../UI/ProfileModal.tsx";
import Assistant from "./AssistantView.tsx";
import SettingsModal from "../UI/SettingsModal";
import { useTranslation } from "react-i18next";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import usePreventZoom from "../UI/usePreventZoom.tsx";

interface PredictionResponse {
  predicted_class: number;
  probabilities: number[];
}

interface SegmentationResponse {
  segmented_image_url: string;
}

const PredictImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [model, setModel] = useState<string>("resnet");
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [segmentation, setSegmentation] = useState<SegmentationResponse | null>(
    null,
  );
  const [anonymizedImageUrl, setAnonymizedImageUrl] = useState<string | null>(
    null,
  );
  const [showAnonChoice, setShowAnonChoice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const { t, i18n } = useTranslation("global");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = new URLSearchParams(location.search).get("imageUrl");

  const auth = getAuth(app);
  const db = getFirestore(app);
  usePreventZoom(true, true);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
  }, [scale]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        getDocs(
          query(
            collection(db, "hcc_ai_users"),
            where("__name__", "==", currentUser.uid),
          ),
        ).then((userDoc) => {
          if (!userDoc.empty) setUserData(userDoc.docs[0].data());
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      backgroundColor: "rgb(0, 0, 0, 0.9)",
    });
    fabricCanvas.setDimensions({ width: 500, height: 500 });

    const brush = new PencilBrush(fabricCanvas);
    brush.color = "black";
    brush.width = 5;
    fabricCanvas.freeDrawingBrush = brush;

    fabric.Image.fromURL(logoHCC_AI, { crossOrigin: "anonymous" }).then(
      (img: fabric.Image) => {
        img.set({
          left: 250,
          top: 250,
          originX: "center",
          originY: "center",
          opacity: 0.1,
          selectable: false,
          evented: false,
        });
        fabricCanvas.backgroundImage = img;
        fabricCanvas.renderAll();
      },
    );

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imgSrc = image ? URL.createObjectURL(image) : imageUrl;
        if (!imgSrc || !canvas) return;

        // Cargar imagen en canvas
        const imageObj = await fabric.Image.fromURL(imgSrc, {
          crossOrigin: "anonymous",
        });
        imageObj.set("id", "backgroundImage");

        const scale = Math.min(500 / imageObj.width!, 500 / imageObj.height!);
        imageObj.scale(scale);
        imageObj.set({
          left: 100,
          top: 100,
          selectable: false,
          lockMovementX: true,
          lockMovementY: true,
          hasControls: false,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        });

        canvas.clear();
        canvas.add(imageObj);
        canvas.centerObject(imageObj);
        canvas.setActiveObject(imageObj);
        toast.success("Imagen cargada correctamente");

        // Si solo tenemos una imageUrl (no un File), la convertimos y la guardamos como File
        if (!image && imageUrl) {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const filename = "imagen_url.jpg";
          const file = new File([blob], filename, { type: blob.type });
          setImage(file);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };
    loadImage();
  }, [image, canvas]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImage(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setImage(file);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!image || isLoading) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/anonymize-ultrasound/`,
        formData,
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);

      setAnonymizedImageUrl(url);
      setShowAnonChoice(true);
      toast.success("Imagen anonimizada correctamente.");
    } catch (error) {
      console.error("Error al anonimizar la imagen:", error);
      toast.error("Ocurrió un error al anonimizar la imagen.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetCanvas = () => {
    if (!canvas) return;

    canvas.clear();

    fabric.Image.fromURL(logoHCC_AI, { crossOrigin: "anonymous" }).then(
      (img: fabric.Image) => {
        img.set({
          left: 250,
          top: 250,
          originX: "center",
          originY: "center",
          opacity: 0.1,
          selectable: false,
          evented: false,
        });
        canvas.backgroundImage = img;
        canvas.renderAll();
      },
    );

    setImage(null); // también reseteamos la imagen
    toast.info("Canvas reiniciado.");
  };

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-500 bg-white text-black dark:bg-gray-600 dark:text-white">
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

      <main className="pt-24 px-6 flex-grow bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 text-black dark:text-white bg-gray-400 dark:bg-gray-800 p-6 rounded-xl shadow-md mx-auto w-fit">
          {/* Contenedor izquierdo: Toolbox + Canvas + Controles */}
          <div className="flex flex-row items-start gap-6">
            {/* Toolbox a la izquierda */}
            <div className="w-[200px] shrink-0">
              <Toolbox canvas={canvas} />
            </div>

            {/* Canvas + controles debajo */}
            <div className="flex flex-col items-center gap-6">
              <EditorCanvas ref={canvasRef} canvas={canvas} />

              {/* Controles de imagen */}
              <div className="flex items-center gap-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="py-4 px-6 bg-gray-300 dark:bg-gray-800 rounded-md border-2 border-dashed border-gray-600  transition duration-300"
                >
                  <p>{t("editor.drop_image")}</p>
                  <input
                    ref={inputRef}
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <button
                  className="py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
                  onClick={() => inputRef.current?.click()}
                >
                  {t("editor.upload_image")}
                </button>
              </div>

              <button
                className={`mt-2 py-2 px-6 font-bold rounded-lg flex items-center justify-center gap-2 transition ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {isLoading
                  ? t("editor.loading_image")
                  : t("editor.anonymize_image")}
              </button>
            </div>
          </div>
        </div>

        {showAnonChoice && anonymizedImageUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg p-6 shadow-xl w-96 space-y-6">
              <h3 className="text-lg font-semibold">¿Qué deseas hacer?</h3>
              <p className="text-sm opacity-80">
                La imagen ha sido anonimizada con éxito.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowAnonChoice(false);
                    const a = document.createElement("a");
                    a.href = anonymizedImageUrl;
                    a.download = "ecografia_anonimizada.jpg";
                    a.click();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Descargar
                </button>
                <button
                  onClick={async () => {
                    setShowAnonChoice(false);
                    if (!canvas) return;

                    const img = await fabric.Image.fromURL(anonymizedImageUrl, {
                      crossOrigin: "anonymous",
                    });

                    const scale = Math.min(500 / img.width!, 500 / img.height!);
                    img.scale(scale);
                    img.set({
                      left: 100,
                      top: 100,
                      selectable: false,
                      lockMovementX: true,
                      lockMovementY: true,
                      hasControls: false,
                      lockRotation: true,
                      lockScalingX: true,
                      lockScalingY: true,
                    });

                    canvas.clear();
                    canvas.add(img);
                    canvas.centerObject(img);
                    canvas.setActiveObject(img);

                    toast.success("Imagen cargada para edición.");
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-md"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black text-white text-center p-4 w-full mt-auto shadow-inner">
        © 2025 HCC-AI
      </footer>
    </div>
  );
};

export default PredictImage;
