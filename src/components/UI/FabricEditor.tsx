import React, { useRef, useEffect, useState } from 'react';
import Toolbox from './Toolbox';
import EditorCanvas from './EditorCanvas';
import '../../App.css';
import * as fabric from 'fabric';
import { Canvas, PencilBrush } from 'fabric';
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import logo_user from "../../assets/images/logo_user.png";
import { useLocation } from 'react-router-dom';
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

const FabricEditor: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [model, setModel] = useState<string>("resnet"); // Default model

  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [segmentation, setSegmentation] = useState<SegmentationResponse | null>(null);
  const [progress, setProgress] = useState<number>(0); // To show the countdown for tab change
  const [showModal, setShowModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);


  const imageUrl = new URLSearchParams(location.search).get('imageUrl');

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, { backgroundColor: 'white' });
      fabricCanvas.setDimensions({ width: 500, height: 500 });

      const brush = new PencilBrush(fabricCanvas);
      brush.color = 'black';
      brush.width = 5;
      fabricCanvas.freeDrawingBrush = brush;

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);
  useEffect(() => {
    if (image && canvas) {
      const loadImage = async () => {
        try {
          const imageObj = await fabric.Image.fromURL(URL.createObjectURL(image), {
            crossOrigin: 'anonymous',
          });

          const maxWidth = 500;
          const maxHeight = 500;
          const scaleX = maxWidth / imageObj.width!;
          const scaleY = maxHeight / imageObj.height!;
          const scale = Math.min(scaleX, scaleY);

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

          canvas.clear(); // Limpiar el canvas antes de añadir la nueva imagen
          canvas.add(imageObj);
          canvas.centerObject(imageObj);
          canvas.setActiveObject(imageObj);

          toast.success('Imagen cargada correctamente');
        } catch (error) {
          console.error('Error loading image:', error);
        }
      };

      loadImage();
    }

    else if (imageUrl && canvas) {
      const loadImage = async () => {
        try {
          const image = await fabric.Image.fromURL(imageUrl, {
            crossOrigin: 'anonymous',
          });

          const maxWidth = 500;
          const maxHeight = 500;
          const scaleX = maxWidth / image.width!;
          const scaleY = maxHeight / image.height!;
          const scale = Math.min(scaleX, scaleY);

          image.scale(scale);
          image.set({
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

          canvas.add(image);
          canvas.centerObject(image);
          canvas.setActiveObject(image);
          
        } catch (error) {
          console.error('Error loading image:', error);
        }
      };

      loadImage();
      toast.success("Imagen cargada!");
    }


  }, [image, canvas]);

  // Función para manejar el cambio de archivo (por ejemplo, al elegir una imagen)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Función para manejar el arrastre y caída de la imagen
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Necesario para permitir que el elemento sea soltado
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0]; // Obtiene el archivo arrastrado
    if (file) {
      setImage(file);
    }
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!image) {
      alert("Por favor, sube una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("model_name", model);

    try {
      // Step 1: Clasificación
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const predictionResponse = await axios.post<PredictionResponse>(
        `${backendUrl}/predict-classification/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      setPrediction(predictionResponse.data);
      
      setProgress(100);
      setTimeout(() => {
        setProgress(5); 
      }, 3000);
      
      // Step 2: Segmentación real con FastAPI
      const segmentationResponse = await axios.post(
        `${backendUrl}/segment/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, responseType: "blob" }
      );
      const imageUrl = URL.createObjectURL(segmentationResponse.data);
  
      setSegmentation({ segmented_image_url: imageUrl });



    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      alert("Ocurrió un error al procesar la imagen.");
    }
  };
  return (
    <div className="bg-black min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
  
      {/* Navbar */}
      <nav className="bg-black p-4 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-xl">
        <ul className="flex space-x-6 text-lg">
          {[{ path: "/", label: "INICIO" }, { path: "/dashboard", label: "VOLVER" }].map((item) => (
            <li key={item.path}>
              <button onClick={() => navigate(item.path)} className="hover:text-gray-300 transition ease-in-out duration-300">
                {item.label}
              </button>
            </li>
          ))}
        </ul>
  
        {/* Logo Central */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logoHCC_AI} className="w-36 max-w-full rounded-md cursor-pointer" alt="HCC-AI Logo" onClick={() => navigate("/")} />
        </div>
  
        {/* Perfil de Usuario */}
        <div className="relative w-64">
          <div className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-800 rounded-lg transition ease-in-out duration-300">
            <img src={logo_user} alt="Perfil" className="w-10 h-10 max-w-full rounded-full" />
            <span className="font-semibold truncate">Usuario</span>
          </div>
        </div>
      </nav>
  
      {/* Contenido Principal */}
      <div className="pt-20 p-6">
        {/* Editor */}
        <div className="editor flex justify-center bg-black text-white p-6 rounded-lg shadow-2xl">
          <div className="editor-left flex-1 flex flex-col items-center gap-6">
            <Toolbox canvas={canvas} />
            <EditorCanvas ref={canvasRef} canvas={canvas} />
            
            <div className="flex items-center gap-6">
              {/* Formulario para subir imagen y seleccionar modelo */}

              {/* Aquí el input para subir imagen */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="file-drop-area py-4 px-6 bg-gray-800 rounded-md text-white border-2 border-dashed border-gray-600 hover:bg-gray-700 transition duration-300"
                style={{ width: '250px' }}  // Ajusta el tamaño del área si lo deseas
              >
                <p>Suelta una imagen aquí</p>
                <input
                  ref={inputRef}
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="file-input hidden"
                />
              </div>

              {/* Botón para seleccionar imagen */}
              <button
                className="py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 transition duration-300"
                onClick={() => inputRef.current?.click()}
              >
                Seleccionar Imagen
              </button>
            </div>



            <select
              value={model}
              onChange={handleModelChange}
              className="model-select py-2 px-4 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 transition duration-300"
            >
              <option value="resnet">ResNet</option>
              <option value="VGG16">VGG</option>
            </select>
  
            <button
              className="predict-button mt-4 py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 transition duration-300"
              onClick={handleSubmit}
            >
              Predecir
            </button>
          </div>
  
          {/* Lado derecho: Resultados */}
          <div className="editor-right flex-1 bg-gray-800 p-6 rounded-lg shadow-xl">
            {/* Mostrar resultados solo si hay segmentación y clasificación */}
            {segmentation && prediction ? (
              <div className="result-display p-4 rounded-lg border-2 border-dashed border-yellow-500 bg-black">
                {/* 1. Imagen Segmentada en Canvas */}
                <h3 className="text-lg font-semibold text-white">Imagen Segmentada:</h3>
                <div className="canvasbox mt-4">
                  <img src={segmentation.segmented_image_url} alt="Segmentación" className="w-full rounded-lg shadow-md" />
                </div>
  
                {/* 2. Probabilidades de Clasificación */}
                <h3 className="mt-6 text-lg font-semibold text-white">Clasificación:</h3>
                <p className="text-xl font-bold text-blue-600">Clase Predicha: F{prediction.predicted_class}</p>
                <p className="mt-2 text-white-700">Probabilidades:</p>
                <ul className="list-disc ml-5 text-white-600">
                  {prediction.probabilities.map((prob, index) => (
                    <li key={index}>F{index}: {prob.toFixed(4)}</li>
                  ))}
                </ul>

                
                {/* Botón para abrir la explicación en modal */}
                <button
                      className="predict-button mt-4 py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 transition duration-300"
                      onClick={() => setShowModal(true)}
                    >
                      Ver Explicación de los Resultados
                    </button>

                    {/* Modal para la Explicación */}
                    {showModal && (
                      <div className="modal fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
                        <div className="modal-content bg-gray-900 rounded-lg p-6 w-11/12 max-w-3xl">
                          {/* Explicación de la clase predicha */}
                          <div className="mt-6 text-white">
                            {prediction.predicted_class === 0 && (
                              <>
                                <h4 className="font-semibold">F0 - No Fibrosis:</h4>
                                <p>Representa tejido hepático sano sin signos de fibrosis. El tejido parece normal, sin cicatrices ni fibrosis presentes.</p>
                              </>
                            )}
                            {prediction.predicted_class === 1 && (
                              <>
                                <h4 className="font-semibold">F1 - Fibrosis Portal:</h4>
                                <p>Indica fibrosis alrededor de las áreas portal del hígado. La fibrosis portal implica la formación de tejido cicatricial alrededor de las venas portal, que son pequeños vasos sanguíneos en el hígado.</p>
                              </>
                            )}
                            {prediction.predicted_class === 2 && (
                              <>
                                <h4 className="font-semibold">F2 - Fibrosis Periportal:</h4>
                                <p>Muestra fibrosis alrededor de los bordes de las áreas portal del hígado. La fibrosis periportal se caracteriza por cicatrización alrededor de las regiones límites del hígado, afectando las áreas cercanas a las venas portal.</p>
                              </>
                            )}
                            {prediction.predicted_class === 3 && (
                              <>
                                <h4 className="font-semibold">F3 - Fibrosis Septal:</h4>
                                <p>Presenta fibrosis que forma bandas o septos a través del tejido hepático. La fibrosis septal implica el desarrollo de tejido cicatricial grueso que crea bandas o particiones dentro del hígado.</p>
                              </>
                            )}
                            {prediction.predicted_class === 4 && (
                              <>
                                <h4 className="font-semibold">F4 - Cirrosis:</h4>
                                <p>Representa fibrosis avanzada que conduce a cirrosis. La cirrosis es la etapa más grave, caracterizada por cicatrización extensa y pérdida de función hepática, lo que puede afectar significativamente la salud del hígado.</p>
                              </>
                            )}
                          </div>
                          <button
                            className="mt-4 py-2 px-6 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-400"
                            onClick={() => setShowModal(false)}
                          >
                            Cerrar
                          </button>
                        </div>

                      </div>
                    )}



              </div>



            ) : (
              <p className="text-gray-400">Esperando segmentación y clasificación...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default FabricEditor;
