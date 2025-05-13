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
import NavbarSecond from "../UI/NavbarSecond.tsx";
import ProfileModal from "../UI/ProfileModal.tsx";
import Assistant from "./Assistant.tsx";
import SettingsModal from "../UI/SettingsModal";

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
  const [progress, setProgress] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = new URLSearchParams(location.search).get("imageUrl");

  const auth = getAuth(app);
  const db = getFirestore(app);

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
      backgroundColor: "white",
    });
    fabricCanvas.setDimensions({ width: 500, height: 500 });

    const brush = new PencilBrush(fabricCanvas);
    brush.color = "black";
    brush.width = 5;
    fabricCanvas.freeDrawingBrush = brush;

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

        const imageObj = await fabric.Image.fromURL(imgSrc, {
          crossOrigin: "anonymous",
        });

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
    if (!image) return alert("Por favor, sube una imagen.");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("model_name", model);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const predictionResponse = await axios.post<PredictionResponse>(
        `${backendUrl}/predict-classification/`,
        formData,
      );
      setPrediction(predictionResponse.data);
      setProgress(100);
      setTimeout(() => setProgress(5), 3000);

      const segmentationResponse = await axios.post(
        `${backendUrl}/segment/`,
        formData,
        { responseType: "blob" },
      );

      const imgUrl = URL.createObjectURL(segmentationResponse.data);
      setSegmentation({ segmented_image_url: imgUrl });
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      alert("Ocurrió un error al procesar la imagen.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

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

      {/* Asistente flotante */}
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

      <main className="pt-24 px-6 flex-grow">
        <div className="flex flex-col lg:flex-row justify-center gap-36 text-white">
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
                  className="py-4 px-6 bg-gray-800 rounded-md border-2 border-dashed border-gray-600 hover:bg-gray-700 transition duration-300"
                >
                  <p>Suelta una imagen aquí</p>
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
                  Seleccionar Imagen
                </button>
              </div>

              {/* Modelo */}
              <select
                value={model}
                onChange={handleModelChange}
                className="py-2 px-4 bg-gray-800 rounded-md mt-2"
              >
                <option value="resnet">ResNet</option>
                <option value="VGG16">VGG</option>
              </select>

              <button
                className="mt-2 py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
                onClick={handleSubmit}
              >
                Predecir
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-xl max-w-[800px]">
            {segmentation && prediction ? (
              <div className="p-4 rounded-lg border-2 border-dashed border-yellow-500 bg-black">
                <h3 className="text-lg font-semibold">Imagen Segmentada:</h3>
                <img
                  src={segmentation.segmented_image_url}
                  alt="Segmentación"
                  className="max-w-[500px] w-full mt-4 rounded-lg shadow-md"
                />

                <h3 className="mt-6 text-lg font-semibold">Clasificación:</h3>
                <p className="text-xl font-bold text-blue-500">
                  Clase Predicha: F{prediction.predicted_class}
                </p>
                <ul className="list-disc ml-5 mt-2 text-white">
                  {prediction.probabilities.map((prob, index) => (
                    <li key={index}>
                      F{index}: {prob.toFixed(4)}
                    </li>
                  ))}
                </ul>

                <button
                  className="mt-4 py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
                  onClick={() => setShowModal(true)}
                >
                  Ver Explicación de los Resultados
                </button>

                {showModal && (
                  <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
                    <div className="bg-gray-900 rounded-lg p-6 w-11/12 max-w-3xl text-white">
                      {prediction.predicted_class === 0 && (
                        <>
                          <h4 className="font-semibold">F0 - No Fibrosis:</h4>
                          <p>Tejido hepático sano.</p>
                        </>
                      )}
                      {prediction.predicted_class === 1 && (
                        <>
                          <h4 className="font-semibold">
                            F1 - Fibrosis Portal:
                          </h4>
                          <p>Fibrosis en áreas portales.</p>
                        </>
                      )}
                      {prediction.predicted_class === 2 && (
                        <>
                          <h4 className="font-semibold">
                            F2 - Fibrosis Periportal:
                          </h4>
                          <p>Fibrosis en bordes de las áreas portales.</p>
                        </>
                      )}
                      {prediction.predicted_class === 3 && (
                        <>
                          <h4 className="font-semibold">
                            F3 - Fibrosis Septal:
                          </h4>
                          <p>Bandas de tejido cicatricial.</p>
                        </>
                      )}
                      {prediction.predicted_class === 4 && (
                        <>
                          <h4 className="font-semibold">F4 - Cirrosis:</h4>
                          <p>Fibrosis avanzada con daño hepático.</p>
                        </>
                      )}
                      <button
                        className="mt-4 py-2 px-6 bg-red-500 text-white font-bold rounded-lg hover:bg-red-400"
                        onClick={() => setShowModal(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">
                Esperando segmentación y clasificación...
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white text-center p-4 w-full mt-auto shadow-inner">
        © 2025 HCC-AI
      </footer>
    </div>
  );
};

export default PredictImage;
