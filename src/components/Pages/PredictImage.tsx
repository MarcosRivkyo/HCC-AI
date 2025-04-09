import React, { useState } from "react";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import { useNavigate } from "react-router-dom";
import Logout from "../Auth/Logout";
import logo_user from "../../assets/images/logo_user.png";
import axios from "axios";

interface PredictionResponse {
  predicted_class: number;
  probabilities: number[];
}

interface SegmentationResponse {
  segmented_image_url: string;
}

interface AssistantResponse {
  explanation: string;
}

const PredictImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [segmentation, setSegmentation] = useState<SegmentationResponse | null>(null);
  const [assistantExplanation, setAssistantExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>("resnet");
  const [activeTab, setActiveTab] = useState("Clasificar");
  const [progress, setProgress] = useState<number>(0); // To show the countdown for tab change

  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedModel(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!image) {
      alert("Por favor, sube una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("model_name", selectedModel);

    setLoading(true);

    try {
      // Step 1: Clasificación
      const predictionResponse = await axios.post<PredictionResponse>(
        "http://localhost:8080/predict-classification/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPrediction(predictionResponse.data);

      setProgress(100);
      setTimeout(() => {
        setActiveTab("Segmentar");
        setProgress(5); 
      }, 3000); 

      // Step 2: Segmentación real con FastAPI
      const segmentationResponse = await axios.post(
        "http://localhost:8080/segment/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, responseType: "blob" } 
      );
  
      const imageUrl = URL.createObjectURL(segmentationResponse.data);
  
      setSegmentation({ segmented_image_url: imageUrl });

      const simulatedAssistantExplanation = {
        explanation: "El modelo ha clasificado la imagen como clase 1 con una probabilidad de 80%.",
      };
      setAssistantExplanation(simulatedAssistantExplanation.explanation);

      setTimeout(() => {
        setActiveTab("Auxiliar");
        setProgress(0); 
      }, 8000); 

    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      alert("Ocurrió un error al procesar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="bg-black p-4 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg">
        <ul className="flex space-x-4 text-sm">
          {[{ path: "/", label: "INICIO" }, { path: "/dashboard", label: "VOLVER" }].map((item) => (
            <li key={item.path}>
              <button onClick={() => navigate(item.path)} className="ml-6 hover:text-gray-300">
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Logo Central */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logoHCC_AI} className="w-32 max-w-full rounded-md cursor-pointer" alt="HCC-AI Logo" onClick={() => navigate("/")} />
        </div>

        {/* Perfil de Usuario */}
        <div className="relative w-64">
          <div className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-800 rounded-lg">
            <img src={logo_user} alt="Perfil" className="w-10 h-10 max-w-full rounded-full" />
            <span className="font-semibold truncate">Usuario</span>
          </div>
        </div>
      </nav>

      {/* Pestañas */}
      <div className="flex justify-center mt-20 mb-4">
        <button 
          onClick={() => setActiveTab("Clasificar")} 
          className={`px-4 py-2 font-semibold ${activeTab === "Clasificar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Clasificar
        </button>
        <button 
          onClick={() => setActiveTab("Segmentar")} 
          className={`px-4 py-2 font-semibold ${activeTab === "Segmentar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Segmentar
        </button>
        <button 
          onClick={() => setActiveTab("Auxiliar")} 
          className={`px-4 py-2 font-semibold ${activeTab === "Auxiliar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Auxiliar
        </button>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row h-full p-10 gap-10">
        {/* Sección Izquierda - Subir Imagen & Selección */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Sube una imagen</h2>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
          {preview && <img src={preview} alt="Vista previa" className="w-full mt-4 rounded-lg shadow" />}
          <div className="mt-4">
            <label className="block font-semibold mb-1">Selecciona el modelo:</label>
            <select value={selectedModel} onChange={handleModelChange} className="w-full p-2 border rounded">
              <option value="resnet">ResNet</option>
              <option value="cnn">CNN</option>
              <option value="VGG16">VGG16</option>
            </select>
          </div>
        </div>

        {/* Botón de Predicción */}
        <div className="flex items-center justify-center w-full md:w-1/3">
          <button 
            type="submit" 
            disabled={loading} 
            onClick={handleSubmit} 
            className="bg-blue-500 text-white font-semibold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            {loading ? "Cargando..." : "Predecir"}
          </button>
        </div>

        {/* Sección Derecha - Resultados */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Resultados</h2>

          {/* Clasificar */}
          {activeTab === "Clasificar" && prediction && (
            <div>
              <p className="text-xl font-bold text-blue-600">Clase Predicha: {prediction.predicted_class}</p>
              <p className="mt-2 text-gray-700">Probabilidades:</p>
              <ul className="list-disc ml-5 text-gray-600">
                {prediction.probabilities.map((prob, index) => (
                  <li key={index}>Clase {index}: {prob.toFixed(4)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Segmentar */}
          {activeTab === "Segmentar" && segmentation && (
            <div>
              <h3 className="text-lg font-semibold">Imagen Segmentada:</h3>
              <img src={segmentation.segmented_image_url} alt="Segmentación" className="mt-4 w-full rounded-lg shadow" />
            </div>
          )}

          {/* Auxiliar */}
          {activeTab === "Auxiliar" && assistantExplanation && (
            <div>
              <h3 className="text-lg font-semibold">Explicación del Asistente:</h3>
              <p className="mt-2 text-gray-700">{assistantExplanation}</p>
            </div>
          )}

          {/* Indicador visual de progreso */}
          {progress > 0 && <p className="text-center mt-4">Faltan {progress} segundos...</p>}
        </div>
      </div>
    </div>
  );
};

export default PredictImage;
