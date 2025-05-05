import React, { useState, useEffect, use } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { app, storage } from '../../config/firebase'; 
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import axios from "axios";

import BarChart from '../UI/BarChart.tsx';
import Navbar from '../UI/NavbarSecond.tsx'; 
import ProfileModal from '../UI/ProfileModal.tsx';
import jsPDF from "jspdf";
import logoHCC_AI from '../../assets/images/logo_hcc_ai.jpg'; 
import Assistant from "./Assistant.tsx";
import { FaEllipsisV, FaDownload, FaTrashAlt } from 'react-icons/fa';

import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'; 

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

type Estudio = {
  studieName: string;
  status: string;
  studieDate: any;
  medicoId: string;
  pacienteId: string;
  clinicalDescription?: string;
  imagenUrl?: string | null;
  maskUrl?: string;
  resultadoIA?: string;
  probabilities?: number[];
};


const EstudioDetalle = () => {

      const { id } = useParams();

      const [estudio, setEstudio] = useState<Estudio | null>(null);
      const [loading, setLoading] = useState(true);
      const [subiendoImagen, setSubiendoImagen] = useState(false);
      const [predict, setPredict] = useState(false);
      const [user, setUser] = useState<any>(null);
      const [userData, setUserData] = useState<any>(null);
      const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);
      const [imagenRedimensionada, setImagenRedimensionada] = useState<string | null>(null);
      const [isProfileOpen, setIsProfileOpen] = useState(false);

      const [editing, setEditing] = useState(false); 
      const [editedEstudio, setEditedEstudio] = useState<Estudio | null>(null); 

      const [parametersVisible, setParametersVisible] = useState(false);
      const [showAssistant, setShowAssistant] = useState(false);
      const [selectedClassificationModel, setSelectedClassificationModel] = useState('');
      const [selectedSegmentationModel, setSelectedSegmentationModel] = useState('');

      const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
      const [segmentation, setSegmentation] = useState<SegmentationResponse | null>(null);
      const [progress, setProgress] = useState<number>(0); // To show the countdown for tab change
      const [showModal, setShowModal] = useState<boolean>(false); // To manage modal visibility

      const navigate = useNavigate();
      const db = getFirestore(app);
      const auth = getAuth();


      useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
      }, []);


      useEffect(() => {
        const fetchEstudioDetalle = async () => {
          if (!id) return;
          try {
            const docRef = doc(db, 'hcc_ai_studies', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setEstudio(docSnap.data() as Estudio);
              setEditedEstudio(docSnap.data() as Estudio); 
            } else {
              console.log('Estudio no encontrado');
            }
          } catch (error) {
            console.error('Error al obtener estudio:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchEstudioDetalle();

      }, [id]);

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
      
        const savedTheme = localStorage.getItem('theme');

        return () => unsubscribe();
      }, [db]);

      useEffect(() => {
        if (estudio && estudio.maskUrl) {
          setSegmentation({ segmented_image_url: estudio.maskUrl });
          setPrediction({ predicted_class: parseInt(estudio.resultadoIA!), probabilities: estudio.probabilities || [] });
        }
      }, [estudio]);


      const getImageAsBase64 = (imageUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = imageUrl;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL("image/png"));
            } else {
              reject("Error al obtener contexto del canvas");
            }
          };
          img.onerror = (err) => reject(err);
        });
      };
      

      const generarPDF = async () => {
        if (!estudio) return;
      
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
      
        // 1. LOGO + CABECERA
        try {
          const logoBase64 = await getImageAsBase64(logoHCC_AI);
          doc.addImage(logoBase64, "PNG", (pageWidth - 40) / 2, 10, 40, 20);
        } catch (e) {
          console.warn("No se pudo cargar el logo:", e);
        }
      
        doc.setFontSize(18);
        doc.setTextColor(33, 37, 41);
        doc.setFont("helvetica", "bold");
        doc.text(" Informe de Estudio HCC-AI", pageWidth / 2, 40, { align: "center" });
      
        doc.setDrawColor(200);
        doc.line(15, 45, pageWidth - 15, 45);
      
        // 2. INFORMACIÓN GENERAL (como tabla)
        doc.setFontSize(13);
        doc.setTextColor(50);
        doc.setFont("helvetica", "normal");
        const yStart = 55;
        const rowHeight = 8;
      
        const rows = [
          [" Nombre del estudio", estudio.studieName],
          [" Estado", estudio.status],
          [" Fecha", estudio.studieDate.toDate().toLocaleString()],
          [" ID del paciente", estudio.pacienteId],
        ];
      
        let y = yStart;
      
        rows.forEach(([label, value]) => {
          doc.setFont("helvetica", "bold");
          doc.text(`${label}:`, 20, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${value}`, 80, y);
          y += rowHeight;
        });
      
        doc.line(15, y, pageWidth - 15, y); // Separador
      
        // 3. DESCRIPCIÓN CLÍNICA
        if (estudio.clinicalDescription) {
          y += 10;
          doc.setFontSize(14);
          doc.setTextColor(33);
          doc.setFont("helvetica", "bold");
          doc.text(" Descripción Clínica", 20, y);
          y += 6;
          doc.setDrawColor(180);
          doc.line(20, y, pageWidth - 20, y);
          y += 6;
      
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(66);
          const descLines = doc.splitTextToSize(estudio.clinicalDescription, 170);
          doc.text(descLines, 20, y);
          y += descLines.length * 6;
        }
      
        // 4. IMAGEN DE ECOGRAFÍA
        if (estudio.imagenUrl) {
          doc.addPage();
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(33);
          doc.text(" Ecografía Cargada por el Usuario", 20, 20);
          doc.setDrawColor(180);
          doc.line(20, 22, pageWidth - 20, 22);
      
          try {
            const base64 = await getImageAsBase64(estudio.imagenUrl);
            doc.addImage(base64, "PNG", 20, 30, 160, 100);
          } catch {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(200, 0, 0);
            doc.text(" No se pudo cargar la imagen de ecografía", 20, 40);
          }
        }
      
        // 5. MÁSCARA IA
        if (estudio.maskUrl) {
          doc.addPage();
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(33);
          doc.text(" Resultado de Segmentación IA", 20, 20);
          doc.line(20, 22, pageWidth - 20, 22);
      
          try {
            const base64 = await getImageAsBase64(estudio.maskUrl);
            doc.addImage(base64, "PNG", 20, 30, 160, 100);
          } catch {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(200, 0, 0);
            doc.text(" No se pudo cargar la máscara IA", 20, 40);
          }
        }
      
        // 6. RESULTADO IA
        if (estudio.resultadoIA) {
          doc.addPage();
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(33);
          doc.text(" Análisis de IA", 20, 20);
          doc.line(20, 22, pageWidth - 20, 22);
      
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50);
          const aiLines = doc.splitTextToSize(estudio.resultadoIA, 170);
          doc.text(aiLines, 20, 30);
        }
      
        // 7. FOOTER con paginación y fecha
        const pageCount = doc.getNumberOfPages();
        const fecha = new Date().toLocaleString();
      
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text(`Página ${i} de ${pageCount}`, pageWidth - 40, 290);
          doc.text(`Generado: ${fecha}`, 20, 290);
        }
      
        // 8. GUARDAR
        doc.save(`Informe_Estudio_${estudio.studieName}.pdf`);
      };
      


      const handleSelectClassificationModel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassificationModel(event.target.value);
      };
    
      const handleSelectSegmentationModel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSegmentationModel(event.target.value);
      };


      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedEstudio((prev) => ({
          ...prev!,
          [name]: value,
        }));
      };


      const handleSaveChanges = async () => {
        if (!id || !editedEstudio) return;

        try {
          const docRef = doc(db, 'hcc_ai_studies', id);
          await updateDoc(docRef, {
            studieName: editedEstudio.studieName,
            clinicalDescription: editedEstudio.clinicalDescription,
          });
          setEstudio(editedEstudio); 
          setEditing(false); 
        } catch (error) {
          console.error('Error al guardar cambios:', error);
        }
      };
      
      const handleCancelEdit = () => {
        setEditing(false);
        setEditedEstudio(estudio); 
      };





      const resizeImage = (file: File) => {
          const img = new Image();
          const reader = new FileReader();
          
          reader.onloadend = () => {
            img.src = reader.result as string;
          };
          
          reader.readAsDataURL(file);

          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = 128;
              canvas.height = 128;
              ctx.drawImage(img, 0, 0, 128, 128);
              const dataUrl = canvas.toDataURL();
              setImagenRedimensionada(dataUrl);
            }
          };
      };








      const handleEliminarEstudio = async () => {
        if (!id) return;

        const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este estudio?');
        if (!confirmacion) return;

        try {
          await deleteDoc(doc(db, 'hcc_ai_studies', id));
          navigate('/dashboard');
        } catch (error) {
          console.error('Error al eliminar estudio:', error);
        }
      };



      const handleEliminarEcografia = async () => {
        if (!estudio || !estudio.imagenUrl) return;
      
        try {

          const userId = user.uid;
          const folderPath = userData.imageFolder || `HCC-AI/users/${userId}/images`;
          const fileName = decodeURIComponent(estudio.imagenUrl.split('%2F').pop()?.split('?')[0] || '');

          const storageRef = ref(storage, `${folderPath}/ecografias/${fileName}`);
          console.log('File name:', fileName);
          console.log('Eliminando imagen de Firebase Storage:', estudio.imagenUrl);

          await deleteObject(storageRef);
          
          const docRef = doc(db, 'hcc_ai_studies', id!);
          await updateDoc(docRef, {
            imagenUrl: null, 
          });
      
          setEstudio((prev) => ({
            ...prev!,
            imagenUrl: null,
          }));
          alert('Ecografía eliminada correctamente');
        } catch (error) {
          console.error('Error al eliminar ecografía:', error);
          alert('Error al eliminar la ecografía');
        }
      };
      
      const procesarImagen = (file: File, tipo: 'ecografias' | 'mask') => {
        setImagenSeleccionada(file);
        resizeImage(file);
        setSubiendoImagen(true);
      
        const userId = user.uid;
        const folderPath = userData.imageFolder || `HCC-AI/users/${userId}/images`;
        const uniqueName = `${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, `${folderPath}/${tipo}/${uniqueName}`);
      
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Subiendo imagen: " + progress + "%");
          },
          (error) => {
            console.error("Error al subir imagen:", error);
            setSubiendoImagen(false); 
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      
              if (!id) return;
      
              const docRef = doc(db, 'hcc_ai_studies', id);
              await updateDoc(docRef, { imagenUrl: downloadURL });
      
              setEstudio((prev) => ({
                ...prev!,
                imagenUrl: downloadURL,
              }));
      
              setSubiendoImagen(false);
            } catch (error) {
              console.error("Error al obtener URL de la imagen:", error);
              setSubiendoImagen(false);
            }
          }
        );
      };

      const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'ecografias' | 'mask') => {
        const file = e.target.files?.[0];
        if (file){
          procesarImagen(file, 'ecografias');
          setImagenSeleccionada(file);
        } 
      };

      
      const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('Drag over event triggered');
        e.preventDefault();
      };
      
      const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('Drop event triggered');
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        
        if (file){
          procesarImagen(file, 'ecografias');
          setImagenSeleccionada(file);
        } 

      };



      const iniciarPrediccionIA = async (event: React.FormEvent): Promise<void> => {

        if (!id) return;
        setPredict(true);
        console.log('Iniciando predicción IA...');
        event.preventDefault();
        console.log('imagenSeleccionada:', imagenSeleccionada);

        if (!imagenSeleccionada) {
          alert("Por favor, sube una imagen.");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", imagenSeleccionada);
        formData.append("model_name", selectedClassificationModel);
    
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
      
    
          const userId = user.uid;
          const folderPath = userData.imageFolder || `HCC-AI/users/${userId}/images`;

          const storageRef = ref(storage, `${folderPath}/masks/masked_${uuidv4()}.png`);

          await uploadBytesResumable(storageRef, segmentationResponse.data);

          const imageUrl = await getDownloadURL(storageRef);
          setSegmentation({ segmented_image_url: imageUrl });

          const docRef = doc(db, 'hcc_ai_studies', id);
          await updateDoc(docRef, {
            resultadoIA: predictionResponse.data.predicted_class.toString(),
            probabilities: predictionResponse.data.probabilities,
            maskUrl: imageUrl,
            status: 'Finalizado',
          });

          setEstudio((prev) => ({
            ...prev!,
            resultadoIA: predictionResponse.data.predicted_class.toString(),
            probabilities: predictionResponse.data.probabilities,

            maskUrl: imageUrl,
            status: 'Finalizado',
          }));

          console.log("Predicción y segmentación completadas.");

          console.log("Predicción:", predictionResponse.data);

          console.log("Segmentación:", imageUrl);
    
        } catch (error) {
          console.error("Error al procesar la imagen:", error);
          alert("Ocurrió un error al procesar la imagen.");
        }
      };
      

      if (loading) return <p className="text-gray-500 text-lg text-center mt-12">Cargando estudio...</p>;
      if (!estudio) return <p className="text-center text-red-600">No se encontró el estudio.</p>;


      return (
        <div className="min-h-screen bg-gray-200 flex flex-col">
          <Navbar userData={userData} onProfileClick={() => setIsProfileOpen(true)} onAssistantClick={() => setShowAssistant(!showAssistant)} />
          <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} userData={userData} user={user} />




          <div className="flex justify-center px-4 py-10 mt-20">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-8">
            
                  <div className="relative">
                    {/* Asistente flotante */}
                    <div
                      className={`fixed top-0 right-0 w-1/4 h-full mt-20 mb-20 bg-gray-800 text-white p-4 transition-transform transform ${
                        showAssistant ? 'translate-x-0' : 'translate-x-full'
                      }`}
                      style={{ zIndex: 1000 }}
                    >
                      {/* Aquí iría el contenido del asistente */}
                      <Assistant />
                    </div>
                  </div>


                  {/* FILA 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Columna izquierda: datos */}
                    <div className="bg-white rounded-xl p-6 space-y-4">
                      {editing ? (
                        <>
                          <input
                            type="text"
                            name="studieName"
                            value={editedEstudio?.studieName || ''}
                            onChange={handleInputChange}
                            className="text-3xl font-bold text-gray-800 w-full border-b-2 border-gray-300"
                          />
                          <textarea
                            name="clinicalDescription"
                            value={editedEstudio?.clinicalDescription || ''}
                            onChange={handleInputChange}
                            rows={4}
                            className="text-gray-600 w-full mt-4 p-2 border-2 border-gray-300 rounded"
                          />
                          <div className="mt-4 flex space-x-4">
                            <button
                              onClick={handleSaveChanges}
                              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600"
                            >
                              Guardar Cambios
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h1 className="text-3xl font-bold text-gray-800">{estudio?.studieName}</h1>
                              <p className="text-sm text-gray-500">ID del estudio: {id}</p>
                            </div>
                            <p className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                              estudio?.status === 'Finalizado' ? 'bg-green-100 text-green-800' :
                              estudio?.status === 'Pendiente IA' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {estudio?.status}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-1">
                            {estudio?.studieDate?.toDate().toLocaleString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          
                          <p className="text-gray-700 mb-1">
                            <strong>IdMédico:</strong> {estudio?.medicoId ?? 'Desconocido'}
                          </p>
                          
                          <p className="text-gray-700 mb-4">
                            <strong>Paciente:</strong> {estudio?.pacienteId}
                          </p>
                          
                          <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-1">Descripción clínica</h2>
                            <p className="text-gray-600">{estudio?.clinicalDescription}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Columna derecha: contenedor flex que incluye la imagen y el menú */}
                    <div className="flex justify-between items-start w-full">
                      {/* Columna con la imagen */}
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="w-64 h-64 border-2 border-dashed border-gray-400 rounded-xl relative bg-gray-50 overflow-hidden flex items-center justify-center"
                      >
                        <label className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center z-10">
                          {estudio?.imagenUrl ? (
                            <img
                              src={estudio.imagenUrl}
                              alt="Imagen del estudio"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-gray-500 text-center">Arrastra o haz clic para subir</span>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImagenChange(e, 'ecografias')}
                            className="hidden"
                          />
                        </label>

                        {/* Botón eliminar */}
                        {estudio?.imagenUrl && (
                          <button
                            onClick={handleEliminarEcografia}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-20"
                            title="Eliminar imagen"
                          >
                            <FaTrashAlt size={14} />
                          </button>
                        )}
                      </div>


                      {/* Menu de acciones */}
                      <div className="relative">
                        <Menu as="div" className="w-48 origin-top-left focus:outline-none z-10">
                          <div>
                            <Menu.Button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
                              <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
                            </Menu.Button>
                          </div>
                          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-10">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => setEditing(true)}
                                    className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2 text-sm text-gray-700`}
                                  >
                                    ✏️ Editar Estudio
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={generarPDF}
                                    className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2 text-sm text-gray-700`}
                                  >
                                    📄 Descargar Informe PDF
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleEliminarEcografia}
                                    className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2 text-sm text-gray-700`}
                                  >
                                    📧 Enviar por correo
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleEliminarEstudio}
                                    className={`${active ? 'bg-red-100 text-red-700' : ''} w-full text-left px-4 py-2 text-sm`}
                                  >
                                    🗑️ Eliminar Estudio
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Menu>
                      </div>
                    </div>
                  </div>
        
        
      
              {/* FILA 2 */}
              <div className="w-full flex justify-center my-4">
                <div className="w-full h-px bg-gray-300"></div> 
              </div>
              
          {/* Botón de Iniciar Análisis */}
          <div className="flex justify-center">
            <button
              onClick={() => setParametersVisible(true)}
              className={`bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 ${parametersVisible ? 'bg-blue-700' : ''}`}
            >
              Iniciar Análisis
            </button>
          </div>

          {/* Mostrar los parámetros del análisis */}
          {parametersVisible && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Elige los parámetros del análisis</h3>

              {/* Select para el modelo de clasificación */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Modelo de Clasificación</label>
                <select
                  value={selectedClassificationModel}
                  onChange={handleSelectClassificationModel}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Selecciona un modelo</option>
                  <option value="resnet">ResNet</option>
                  <option value="VGG16">VGG16</option>
                </select>
              </div>

              {/* Select para el modelo de segmentación */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Modelo de Segmentación</label>
                <select
                  value={selectedSegmentationModel}
                  onChange={handleSelectSegmentationModel}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Selecciona un modelo</option>
                  <option value="YOLOv8">YOLOv8</option>
                </select>
              </div>

              {/* Botón para iniciar la predicción */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={iniciarPrediccionIA}
                  className={`bg-yellow-400 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${!selectedClassificationModel || !selectedSegmentationModel ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={ !selectedClassificationModel || !selectedSegmentationModel}
                >
                  Iniciar Predicción
                </button>
              </div>
            </div>
          )}
          {/* Lado derecho: Resultados */}
          <div className="flex-1 p-8">
      {segmentation && prediction ? (
        <div className="result-display p-6 rounded-lg border-2 border-dashed">
          {/* Imagen Segmentada */}
          <h3 className="text-xl font-semibold text-black">Imagen Segmentada:</h3>
          <div className="mt-4 flex justify-center">
            <img
              src={segmentation.segmented_image_url}
              alt="Segmentación"
              className="max-w-full rounded-lg shadow-md"
            />
          </div>

          {/* Gráfico de Probabilidades */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white">Gráfico de Probabilidades</h3>
            <div className="mt-4">
              <BarChart probabilities={prediction.probabilities} />
            </div>
          </div>

          {/* Clasificación Predicha */}
          <h3 className="mt-8 text-xl font-semibold text-white">Clasificación Predicha:</h3>
          <p className="text-2xl font-bold text-blue-500">
            Clase Predicha: F{prediction.predicted_class}
          </p>
          <p className="mt-4 text-lg text-black">Probabilidades de cada clase:</p>
          <ul className="list-disc ml-6 text-black text-sm">
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
        <p className="text-gray-500 text-lg">Esperando segmentación y clasificación...</p>
      )}
    </div>

      
            </div>
          </div>
            {/* Footer */}
          <footer className="bg-gray-900 text-white text-center p-4 w-full mt-auto shadow-lg rounded-t-lg mb-0">
            © 2025 HCC-AI
          </footer>
        </div>
      );
      
};

export default EstudioDetalle;
