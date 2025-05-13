import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, storage } from "../../config/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BarChart from "../UI/BarChart.tsx";
import { marked } from "marked";

import NavbarSecond from "../UI/NavbarSecond.tsx";

import ProfileModal from "../UI/ProfileModal.tsx";
import jsPDF from "jspdf";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import Assistant from "./Assistant.tsx";
import { FaEllipsisV, FaDownload, FaTrashAlt } from "react-icons/fa";
import SettingsModal from "../UI/SettingsModal";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import EstudiosRecientesCompact from "../UI/EstudioRecientesCompact.tsx";

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
  doctorName: string;
  patientName: string;
  clinicalDescription?: string;
  imagenUrl?: string | null;
  pdfReportUrl?: string | null;
  predictionId?: string;
};

type Prediction = {
  maskUrl?: string;
  predicted_class: number;
  probabilities: number[];
  classificationModel?: string;
  classificationSubModel?: string;
  segmentationModel?: string;
  segmentationSubModel?: string;
  confidenceThreshold?: number;
  explanation?: string;
};

const EstudioDetalle = () => {
  const { id } = useParams();

  const [estudio, setEstudio] = useState<Estudio | null>(null);
  const [selectedSubModel, setSelectedSubModel] = useState("");

  const [loading, setLoading] = useState(true);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [predict, setPredict] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(
    null,
  );
  const [imagenRedimensionada, setImagenRedimensionada] = useState<
    string | null
  >(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedSegmentationSubModel, setSelectedSegmentationSubModel] =
    useState("");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [htmlExplicacion, setHtmlExplicacion] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [editedEstudio, setEditedEstudio] = useState<Estudio | null>(null);

  const [parametersVisible, setParametersVisible] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedClassificationModel, setSelectedClassificationModel] =
    useState("");
  const [selectedSegmentationModel, setSelectedSegmentationModel] =
    useState("");
  const [showLegendModal, setShowLegendModal] = useState(false);

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [segmentation, setSegmentation] = useState<SegmentationResponse | null>(
    null,
  );
  const [explicacionGenerada, setExplicacionGenerada] = useState<string>("");
  const [progress, setProgress] = useState<number>(0); // To show the countdown for tab change
  const [showModal, setShowModal] = useState<boolean>(false); // To manage modal visibility
  const [usarExplicacionIA, setUsarExplicacionIA] = useState(true);

  const [fileName, setFileName] = useState<string>(""); // si quieres usarlo como estado

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
  const [mostrarEstudiosRecientes, setMostrarEstudiosRecientes] =
    useState(false);

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
        const docRef = doc(db, "hcc_ai_studies", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEstudio(docSnap.data() as Estudio);
          setEditedEstudio(docSnap.data() as Estudio);
        } else {
          console.log("Estudio no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener estudio:", error);
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

    const savedTheme = localStorage.getItem("theme");

    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    const fetchPredictionData = async () => {
      if (!estudio?.predictionId) return;

      try {
        const predictionRef = doc(
          db,
          "hcc_ai_predictions",
          estudio.predictionId,
        );
        const predictionSnap = await getDoc(predictionRef);

        if (predictionSnap.exists()) {
          const predictionData = predictionSnap.data() as Prediction;

          setPrediction({
            predicted_class: predictionData.predicted_class,
            probabilities: predictionData.probabilities,
          });

          setSegmentation({
            segmented_image_url: predictionData.maskUrl || "",
          });

          if (predictionData.classificationModel)
            setSelectedClassificationModel(predictionData.classificationModel);

          if (predictionData.classificationSubModel)
            setSelectedSubModel(predictionData.classificationSubModel);

          if (predictionData.segmentationModel)
            setSelectedSegmentationModel(predictionData.segmentationModel);

          if (predictionData.segmentationSubModel)
            setSelectedSegmentationSubModel(
              predictionData.segmentationSubModel,
            );

          if (predictionData.confidenceThreshold)
            setConfidenceThreshold(predictionData.confidenceThreshold);

          if (predictionData.explanation) {
            setExplicacionGenerada(predictionData.explanation);
            const html = await marked.parse(predictionData.explanation);
            setHtmlExplicacion(html);
          }
        } else {
          console.log("No se encontró la predicción.");
        }
      } catch (error) {
        console.error("Error al obtener la predicción:", error);
      }
    };

    fetchPredictionData();
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

  const descargarPDF = () => {
    if (!estudio?.pdfReportUrl) {
      alert(
        "No se encontró el informe PDF. Asegúrate de haber generado el análisis primero.",
      );
      return;
    }
    window.open(estudio.pdfReportUrl, "_blank");
  };

  const generarPDF = async (
    predictionData: PredictionResponse,
    segmentationUrl: string,
    explicacionGenerada: string,
  ) => {
    if (!estudio) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;

    // 1. LOGO + CABECERA
    try {
      const logoBase64 = await getImageAsBase64(logoHCC_AI);
      pdf.addImage(logoBase64, "PNG", (pageWidth - 40) / 2, 10, 40, 20);
    } catch {
      console.warn("No se pudo cargar el logo");
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(30, 30, 30);
    pdf.text("INFORME CLÍNICO - HCC-AI", pageWidth / 2, 35, {
      align: "center",
    });

    // 2. CONTENEDOR GENERAL
    const drawSectionBox = (yStart: number, height: number, label: string) => {
      pdf.setDrawColor(180);
      pdf.rect(margin, yStart, pageWidth - 2 * margin, height);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(label.toUpperCase(), margin + 2, yStart + 6);
      return yStart + 12;
    };

    let y = 45;

    // 3. INFORMACIÓN GENERAL
    y = drawSectionBox(y, 40, "Datos del Estudio");

    const generalInfo = [
      ["Nombre del Estudio", estudio.studieName],
      ["Estado", estudio.status],
      ["Fecha", estudio.studieDate.toDate().toLocaleString()],
      ["ID del Paciente", estudio.patientName],
    ];

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    generalInfo.forEach(([label, val], idx) => {
      pdf.text(`${label}:`, margin + 5, y + idx * 7);
      pdf.text(`${val}`, margin + 65, y + idx * 7);
    });
    y += generalInfo.length * 7 + 10;

    // 4. DESCRIPCIÓN CLÍNICA
    if (estudio.clinicalDescription) {
      y = drawSectionBox(y, 40, "Descripción Clínica");
      const descLines = pdf.splitTextToSize(
        estudio.clinicalDescription,
        pageWidth - 2 * margin - 10,
      );
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text(descLines, margin + 5, y);
      y += descLines.length * 6 + 10;
    }

    // 5. IMÁGENES: ECOGRAFÍA + SEGMENTACIÓN
    if (estudio.imagenUrl || segmentation?.segmented_image_url) {
      y = drawSectionBox(y, 80, "Imágenes del Estudio");

      const imgSize = 67.7; // 256px ≈ 67.7mm
      const spacing = 10;
      const x1 = (pageWidth - imgSize * 2 - spacing) / 2;
      const x2 = x1 + imgSize + spacing;
      const yImg = y;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(33);
      pdf.text("Ecografía", x1 + imgSize / 2, yImg - 3, { align: "center" });
      pdf.text("Segmentación IA", x2 + imgSize / 2, yImg - 3, {
        align: "center",
      });

      try {
        if (estudio.imagenUrl) {
          const base64 = await getImageAsBase64(estudio.imagenUrl);
          pdf.addImage(base64, "PNG", x1, yImg, imgSize, imgSize);
        }
      } catch {
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(200, 0, 0);
        pdf.text("Error al cargar", x1 + imgSize / 2, yImg + imgSize / 2, {
          align: "center",
        });
      }

      try {
        if (segmentationUrl) {
          const base64 = await getImageAsBase64(segmentationUrl);
          pdf.addImage(base64, "PNG", x2, yImg, imgSize, imgSize);
        }
      } catch {
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(200, 0, 0);
        pdf.text("Error al cargar", x2 + imgSize / 2, yImg + imgSize / 2, {
          align: "center",
        });
      }

      y += imgSize + 20;
    }

    // 7. RESULTADO IA
    if (predictionData?.predicted_class) {
      const explicacionTextoPlano =
        explicacionGenerada || "Sin explicación disponible.";

      // Altura dinámica según el contenido
      const explicacionLines = pdf.splitTextToSize(
        explicacionTextoPlano,
        pageWidth - 2 * margin - 10,
      );

      const blockHeight = Math.max(35, explicacionLines.length * 6 + 10);

      y = drawSectionBox(y, blockHeight, "Análisis de IA");

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50);

      // Muestra el código de clase
      const claseMapeada =
        selectedClassificationModel === "HCC-AI"
          ? ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
              predictionData.predicted_class
            ]
          : `F${predictionData.predicted_class}`;

      pdf.text(`Clase predicha: ${claseMapeada}`, margin + 5, y);
      // Explicación IA
      pdf.setFontSize(11);

      const lineHeight = 6;
      let currentY = y + 8;

      pdf.setFontSize(11);

      for (const line of explicacionLines) {
        if (currentY > 280) {
          // límite inferior de la página
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(line, margin + 5, currentY);
        currentY += lineHeight;
      }
      y = currentY + 10;
    }

    // 8. FOOTER
    const pageCount = pdf.getNumberOfPages();
    const fecha = new Date().toLocaleString();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 30, 290);
      pdf.text(`Generado: ${fecha}`, margin, 290);
    }

    // 9. GUARDAR
    //doc.save(`Informe_Estudio_${estudio.studieName}.pdf`);

    const pdfBlob = pdf.output("blob");
    const userId = user.uid;
    const folderPath =
      userData.documentFolder || `HCC-AI/users/${userId}/documents`;
    const pdfFileName = `informe_${id}.pdf`;
    const pdfRef = ref(storage, `${folderPath}/${pdfFileName}`);

    try {
      await uploadBytesResumable(pdfRef, pdfBlob);
      const downloadURL = await getDownloadURL(pdfRef);

      if (id) {
        const docRef = doc(db, "hcc_ai_studies", id);
        await updateDoc(docRef, {
          pdfReportUrl: downloadURL,
        });

        setEstudio((prev) => ({
          ...prev!,
          pdfReportUrl: downloadURL,
        }));
      }

      console.log("PDF subido y URL guardada correctamente:", downloadURL);
    } catch (error) {
      console.error("Error al subir el PDF a Storage:", error);
    }
  };

  const enviarPDFporCorreo = async () => {
    if (!estudio?.pdfReportUrl) {
      alert("Primero debes generar el informe PDF.");
      return;
    }

    const destinatario = prompt(
      "Introduce el correo electrónico del destinatario:",
    );
    if (!destinatario || !destinatario.includes("@")) {
      alert("Correo no válido.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-report`, {
        name: userData?.firstName || user.displayName || "Médico HCC-AI",
        email: destinatario,
        message: `Te comparto el informe clínico del estudio "${estudio.studieName}". Puedes descargarlo aquí:\n\n${estudio.pdfReportUrl}`,
      });

      if (response.status === 200) {
        toast.success("Informe enviado correctamente.");
      } else {
        toast.error("No se pudo enviar el correo.");
      }
    } catch (error) {
      console.error("Error al enviar informe por correo:", error);
      toast.error("Ocurrió un error al enviar el correo.");
    }
  };

  const handleSelectClassificationModel = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedClassificationModel(event.target.value);
  };

  const handleSelectSegmentationModel = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSegmentationModel(event.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedEstudio((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!id || !editedEstudio) return;

    try {
      const docRef = doc(db, "hcc_ai_studies", id);
      await updateDoc(docRef, {
        studieName: editedEstudio.studieName,
        clinicalDescription: editedEstudio.clinicalDescription,
      });
      setEstudio(editedEstudio);
      setEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
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
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
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

    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este estudio?",
    );
    if (!confirmacion) return;

    try {
      await deleteDoc(doc(db, "hcc_ai_studies", id));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al eliminar estudio:", error);
    }
  };

  const handleEliminarEcografia = async () => {
    if (!estudio || !estudio.imagenUrl) return;

    try {
      const userId = user.uid;
      const folderPath =
        userData.imageFolder || `HCC-AI/users/${userId}/images`;
      const fileName = decodeURIComponent(
        estudio.imagenUrl.split("%2F").pop()?.split("?")[0] || "",
      );

      const storageRef = ref(storage, `${folderPath}/ecografias/${fileName}`);
      console.log("File name:", fileName);
      console.log("Eliminando imagen de Firebase Storage:", estudio.imagenUrl);

      await deleteObject(storageRef);

      const docRef = doc(db, "hcc_ai_studies", id!);
      await updateDoc(docRef, {
        imagenUrl: null,
      });

      setEstudio((prev) => ({
        ...prev!,
        imagenUrl: null,
      }));
      alert("Ecografía eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar ecografía:", error);
      alert("Error al eliminar la ecografía");
    }
  };

  const procesarImagen = (file: File, tipo: "ecografias" | "mask") => {
    setImagenSeleccionada(file);
    resizeImage(file);
    setSubiendoImagen(true);

    const userId = user.uid;
    const folderPath = userData.imageFolder || `HCC-AI/users/${userId}/images`;

    const generatedFileName = `${uuidv4()}_${file.name}`;
    setFileName(generatedFileName); // Reactivo por si se usa luego

    const storageRef = ref(
      storage,
      `${folderPath}/${tipo}/${generatedFileName}`,
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Subiendo imagen (${tipo}): ${progress}%`);
      },
      (error) => {
        console.error("Error al subir imagen:", error);
        setSubiendoImagen(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          if (!id) return;

          const docRef = doc(db, "hcc_ai_studies", id);

          if (tipo === "ecografias") {
            await updateDoc(docRef, { imagenUrl: downloadURL });
            setEstudio((prev) => ({ ...prev!, imagenUrl: downloadURL }));
          } else if (tipo === "mask") {
            await updateDoc(docRef, { maskUrl: downloadURL });
            setEstudio((prev) => ({ ...prev!, maskUrl: downloadURL }));
          }

          setSubiendoImagen(false);
        } catch (error) {
          console.error("Error al obtener URL de la imagen:", error);
          setSubiendoImagen(false);
        }
      },
    );
  };

  const handleImagenChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: "ecografias" | "mask",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarImagen(file, "ecografias");
      setImagenSeleccionada(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drag over event triggered");
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop event triggered");
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      procesarImagen(file, "ecografias");
      setImagenSeleccionada(file);
    }
  };

  const explicarResultadoConIA = async (
    predicted_class: string,
    etiquetas: string[],
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/explain-results/`,
        {
          predicted_class: predicted_class,
          labels: etiquetas,
        }
      );

      if (response.status === 200 && response.data?.explicacion) {
        console.log("Explicación generada:", response.data.explicacion);
        return response.data.explicacion;
      } else {
        console.warn(
          "Respuesta inesperada al explicar resultados IA",
          response,
        );
        return "No se pudo generar una explicación automática.";
      }
    } catch (error) {
      console.error("Error al explicar resultados IA:", error);
      return "Error al conectar con el servicio de explicación médica.";
    }
  };

  const iniciarPrediccionIA = async (event: React.FormEvent): Promise<void> => {
    if (!id) return;

    console.log("Iniciando predicción IA...");
    event.preventDefault();
    console.log("imagenSeleccionada:", imagenSeleccionada);

    if (!imagenSeleccionada) {
      alert("Por favor, sube una imagen.");
      return;
    }

    setPredict(true);
    const formData = new FormData();
    formData.append("file", imagenSeleccionada);
    formData.append("model_name", selectedSubModel);

    try {
      // Step 1: Clasificación
      //const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const predictionResponse = await axios.post<PredictionResponse>(
        `${backendUrl}/predict-classification/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );


      setPrediction(predictionResponse.data);
      console.log("Predicción:", predictionResponse.data);
      setProgress(100);
      setTimeout(() => {
        setProgress(5);
      }, 3000);

      // Step 2: Segmentación real con FastAPI
      // const segmentationResponse = await axios.post(
      //   `${backendUrl}/segment/?confidence_threshold=${confidenceThreshold.toFixed(2)}`,
      //   formData,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //     responseType: "blob",
      //   }
      // );


      const segmentationResponse = await axios.post(
        `${backendUrl}/segment/?confidence_threshold=${confidenceThreshold.toFixed(2)}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );


      const { image_base64, detected_labels, confidence_threshold } =
        segmentationResponse.data;

      console.log("Detected labels:", detected_labels);
      console.log("Threshold:", confidence_threshold);

      const imageBlob = await (
        await fetch(`data:image/jpeg;base64,${image_base64}`)
      ).blob();

      const userId = user.uid;
      const folderPath =
        userData.imageFolder || `HCC-AI/users/${userId}/images`;

      const storageRef = ref(
        storage,
        `${folderPath}/masks/masked_${fileName}.png`,
      );

      await uploadBytesResumable(storageRef, imageBlob);

      const imageUrl = await getDownloadURL(storageRef);
      setSegmentation({ segmented_image_url: imageUrl });
      console.log("Segmentación:", imageUrl);

      let explicacion = "";

      if (usarExplicacionIA) {
        const claseMapeada =
          selectedClassificationModel === "HCC-AI"
            ? ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
                predictionResponse.data.predicted_class
              ]
            : `F${predictionResponse.data.predicted_class}`;

        explicacion = await explicarResultadoConIA(
          claseMapeada,
          detected_labels,
        );
      } else {
        explicacion =
          "No se generó una explicación automática (opción desactivada).";
      }

      setExplicacionGenerada(explicacion);
      const html = await marked.parse(explicacion);
      setHtmlExplicacion(html);

      const predictionDocRef = await addDoc(
        collection(db, "hcc_ai_predictions"),
        {
          predicted_class: predictionResponse.data.predicted_class,
          probabilities: predictionResponse.data.probabilities,
          maskUrl: imageUrl,
          createdAt: new Date(),
          classificationModel: selectedClassificationModel,
          classificationSubModel: selectedSubModel,
          segmentationModel: selectedSegmentationModel,
          segmentationSubModel: selectedSegmentationSubModel,
          confidenceThreshold: confidenceThreshold,
          explanation: explicacion,
        },
      );

      const docRefStudy = doc(db, "hcc_ai_studies", id);
      await updateDoc(docRefStudy, {
        predictionId: predictionDocRef.id,
        status: "Finalizado",
      });

      setEstudio((prev) => ({
        ...prev!,
        resultadoIA: predictionResponse.data.predicted_class,
        probabilities: predictionResponse.data.probabilities,
        maskUrl: imageUrl,
        status: "Finalizado",
        predictionId: predictionDocRef.id,
      }));

      await generarPDF(predictionResponse.data, imageUrl, explicacion);
      setParametersVisible(false);

      console.log("Predicción y segmentación completadas.");

      console.log("Predicción:", predictionResponse.data);

      console.log("Segmentación:", imageUrl);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      alert("Ocurrió un error al procesar la imagen.");
    } finally {
      setPredict(false);
    }
  };

  if (loading)
    return (
      <p className="text-gray-500 text-lg text-center mt-12">
        Cargando estudio...
      </p>
    );
  if (!estudio)
    return (
      <p className="text-center text-red-600">No se encontró el estudio.</p>
    );

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
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
      />

      {/* Botón para mostrar el panel lateral izquierdo */}
      {!mostrarEstudiosRecientes && (
        <button
          onClick={() => setMostrarEstudiosRecientes(true)}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 shadow"
          title="Mostrar estudios recientes"
        >
          <FiArrowRight />
        </button>
      )}

      {mostrarEstudiosRecientes && (
        <button
          onClick={() => setMostrarEstudiosRecientes(false)}
          className="fixed top-1/2 left-64 transform -translate-y-1/2 z-50 bg-gray-600 text-white p-2 rounded-r-md hover:bg-gray-700 shadow"
          title="Ocultar estudios recientes"
        >
          <FiArrowLeft />
        </button>
      )}

      <NavbarSecond
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAssistantClick={() => setShowAssistant(!showAssistant)}
      />
      {/* Panel lateral de estudios recientes */}
      {mostrarEstudiosRecientes && (
        <div className="fixed top-0 left-0 h-full w-64  shadow-lg z-40 transition-transform transform">
          <div className="h-full flex flex-col justify-center p-4">
            <EstudiosRecientesCompact />
          </div>
        </div>
      )}

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

      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] px-4 py-10 mt-20">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div className="relative">
            {/* Asistente flotante */}
            <div
              className={`fixed top-20 bottom-1 right-0 w-1/4 bg-gray-800 text-white p-4 transition-transform transform ${
                showAssistant ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ zIndex: 1000 }}
            >
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
                    value={editedEstudio?.studieName || ""}
                    onChange={handleInputChange}
                    className="text-3xl font-bold text-gray-800 w-full border-b-2 border-gray-300"
                  />
                  <textarea
                    name="clinicalDescription"
                    value={editedEstudio?.clinicalDescription || ""}
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
                      <h1 className="text-3xl font-bold text-gray-800">
                        {estudio?.studieName}
                      </h1>
                      <p className="text-sm text-gray-500">
                        ID del estudio: {id}
                      </p>
                    </div>
                    <p
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        estudio?.status === "Finalizado"
                          ? "bg-green-100 text-green-800"
                          : estudio?.status === "Pendiente IA"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {estudio?.status}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400 mb-1">
                    {estudio?.studieDate?.toDate().toLocaleString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="text-gray-700 mb-1">
                    <strong>Médico:</strong>{" "}
                    {estudio?.doctorName ?? "Desconocido"}
                  </p>

                  <p className="text-gray-700 mb-4">
                    <strong>Paciente:</strong> {estudio?.patientName}
                  </p>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">
                      Descripción clínica
                    </h2>
                    <p className="text-gray-600">
                      {estudio?.clinicalDescription}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Columna derecha: contenedor flex que incluye la imagen y el menú */}
            <div className="flex justify-between items-start w-full">
              {/* Columna con la imagen */}
              <div
                onDragOver={(e) => {
                  if (!estudio?.predictionId) {
                    e.preventDefault();
                  }
                }}
                onDrop={(e) => {
                  if (!estudio?.predictionId) {
                    handleDrop(e);
                  }
                }}
                className="w-64 h-64 border-2 border-dashed border-gray-400 rounded-xl relative bg-gray-50 overflow-hidden flex items-center justify-center"
              >
                <label className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center z-10">
                  {subiendoImagen ? (
                    <div className="flex flex-col items-center justify-center text-center text-gray-600">
                      <svg
                        className="animate-spin h-8 w-8 text-blue-500 mb-2"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Subiendo imagen...
                    </div>
                  ) : estudio?.imagenUrl ? (
                    <img
                      src={estudio.imagenUrl}
                      alt="Imagen del estudio"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-center">
                      Arrastra o haz clic para subir
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      estudio?.predictionId
                        ? undefined
                        : handleImagenChange(e, "ecografias")
                    }
                    disabled={!!estudio?.predictionId}
                    className="hidden"
                  />
                </label>

                {/* Botón eliminar */}
                {estudio?.imagenUrl && !estudio.predictionId && (
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
                <Menu
                  as="div"
                  className="w-48 origin-top-left focus:outline-none z-10"
                >
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
                            onClick={descargarPDF}
                            className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Descargar Informe
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={enviarPDFporCorreo}
                            className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Enviar informe por correo
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleEliminarEstudio}
                            className={`${active ? "bg-red-100 text-red-700" : ""} w-full text-left px-4 py-2 text-sm`}
                          >
                            Eliminar Estudio
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

          {!estudio?.predictionId && (
            <div className="flex justify-center">
              <button
                onClick={() => setParametersVisible(true)}
                className={`bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 ${parametersVisible ? "bg-blue-700" : ""}`}
              >
                Iniciar Análisis
              </button>
            </div>
          )}

          {/* Mostrar los parámetros del análisis */}
          {parametersVisible && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Elige los parámetros del análisis
              </h3>

              {/* Modelo de Clasificación */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Modelo de Clasificación
                </label>
                <div className="flex gap-4">
                  {[
                    {
                      name: "HCC-AI",
                      description:
                        "Modelo entrenado específicamente para clasificar etapas de fibrosis hepática HCC.",
                    },
                    {
                      name: "METAVIR-AI",
                      description:
                        "Modelo basado en la escala METAVIR (F0 a F4) para análisis de fibrosis hepática.",
                    },
                  ].map((model) => (
                    <button
                      key={model.name}
                      title={model.description}
                      onClick={() => {
                        setSelectedClassificationModel(model.name);
                        if (model.name !== "METAVIR-AI") {
                          setSelectedSubModel("efficient_net");
                        }
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition ${
                        selectedClassificationModel === model.name
                          ? "bg-blue-600 text-white border-blue-700"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>

                {/* Submodelo desplegable para METAVIR-AI */}
                {selectedClassificationModel === "METAVIR-AI" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submodelo de METAVIR-AI
                    </label>
                    <select
                      value={selectedSubModel}
                      onChange={(e) => setSelectedSubModel(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecciona un submodelo</option>
                      <option value="resnet">ResNet</option>
                      <option value="VGG16">VGG16</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Modelo de Segmentación */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Modelo de Segmentación
                </label>
                <div className="flex gap-4">
                  {["SegmentadorHepático-AI"].map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedSegmentationModel(model);
                        setSelectedSegmentationSubModel(""); // Reiniciar submodelo
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition ${
                        selectedSegmentationModel === model
                          ? "bg-green-600 text-white border-green-700"
                          : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>

                {/* Submodelo desplegable solo si selecciona SEGMENTADOHEPATICO-AI */}
                {selectedSegmentationModel === "SegmentadorHepático-AI" && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Submodelo de Segmentación */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Submodelo de Segmentación
                        </label>
                        <select
                          value={selectedSegmentationSubModel}
                          onChange={(e) =>
                            setSelectedSegmentationSubModel(e.target.value)
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Selecciona un submodelo</option>
                          <option value="YOLOv8">YOLOv8</option>
                          <option value="YOLOv11">YOLOv11</option>
                        </select>
                      </div>

                      {/* Umbral de Confianza */}
                      <div>
                        <label
                          htmlFor="confidenceThreshold"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Umbral mínimo de confianza (%)
                        </label>
                        <input
                          id="confidenceThreshold"
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={confidenceThreshold * 100}
                          onChange={(e) =>
                            setConfidenceThreshold(
                              parseFloat(e.target.value) / 100,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Solo se mostrarán segmentaciones con confianza igual o
                          superior.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="usarExplicacionIA"
                    checked={usarExplicacionIA}
                    onChange={() => setUsarExplicacionIA(!usarExplicacionIA)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="usarExplicacionIA"
                    className="text-sm text-gray-700"
                  >
                    Generar una explicación médica automática basada en los
                    resultados
                  </label>
                </div>
              </div>

              {/* Botón para iniciar la predicción */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={iniciarPrediccionIA}
                  className={`bg-yellow-400 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${!selectedClassificationModel || !selectedSegmentationModel ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={
                    !selectedClassificationModel || !selectedSegmentationModel
                  }
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
                {/* Modelos utilizados */}
                <div className="mt-8 bg-gray-100 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">
                    Parámetros Utilizados
                  </h4>
                  <ul className="text-sm text-gray-700 leading-6">
                    <li>
                      <strong>Modelo de Clasificación:</strong>{" "}
                      {selectedClassificationModel}
                      {selectedClassificationModel === "METAVIR-AI" &&
                        selectedSubModel && <span> ({selectedSubModel})</span>}
                    </li>
                    <li>
                      <strong>Modelo de Segmentación:</strong>{" "}
                      {selectedSegmentationModel}
                      {selectedSegmentationModel === "SegmentadorHepático-AI" &&
                        selectedSegmentationSubModel && (
                          <span> ({selectedSegmentationSubModel})</span>
                        )}
                    </li>
                    <li>
                      <strong>Confianza mínima:</strong>{" "}
                      {Math.round(confidenceThreshold * 100)}%
                    </li>
                  </ul>
                </div>

                {/* Imagen Segmentada */}
                <h3 className="text-xl mt-10 font-semibold text-black">
                  Imagen Segmentada:
                </h3>

                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setShowLegendModal(true)}
                    title="Ver leyenda de las etiquetas"
                    className="w-8 h-8 flex items-center justify-center bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
                  >
                    ?
                  </button>
                </div>

                <div className="mt-4 flex justify-center">
                  <img
                    src={segmentation.segmented_image_url}
                    alt="Segmentación"
                    className="max-w-full rounded-lg shadow-md"
                  />

                  {showLegendModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                          Leyenda de Etiquetas
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li>
                            <strong>HCC</strong>: Carcinoma hepatocelular
                          </li>
                          <li>
                            <strong>HV</strong>: Vena hepática
                          </li>
                          <li>
                            <strong>IVC</strong>: Vena cava inferior
                          </li>
                          <li>
                            <strong>K</strong>: Riñón
                          </li>
                          <li>
                            <strong>K-C</strong>: Corteza renal
                          </li>
                          <li>
                            <strong>K-M</strong>: Médula renal
                          </li>
                          <li>
                            <strong>TRANS</strong>: Corte transversal
                          </li>
                          <li>
                            <strong>LVR</strong>: Hígado
                          </li>
                          <li>
                            <strong>PV</strong>: Vena porta
                          </li>
                          <li>
                            <strong>SAG</strong>: Corte sagital
                          </li>
                          <li>
                            <strong>SAG K</strong>: Corte sagital renal
                          </li>
                          <li>
                            <strong>LT SAG</strong>: Lóbulo izquierdo (sagital)
                          </li>
                          <li>
                            <strong>RT TRANS</strong>: Lóbulo derecho
                            (transversal)
                          </li>
                          <li>
                            <strong>BND</strong>: Banda de fibrosis
                          </li>
                          <li>
                            <strong>VSL</strong>: Vasos sanguíneos
                          </li>
                        </ul>
                        <button
                          onClick={() => setShowLegendModal(false)}
                          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clasificación Predicha */}
                <h3 className="mt-8 text-xl font-semibold text-white">
                  Clasificación Predicha:
                </h3>
                <p className="text-2xl font-bold text-blue-500">
                  Clase Predicha:{" "}
                  {selectedClassificationModel === "METAVIR-AI"
                    ? `F${prediction.predicted_class}`
                    : ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
                        prediction.predicted_class
                      ]}
                </p>

                <p className="mt-4 text-lg text-black">
                  Probabilidades de cada clase:
                </p>
                <ul className="list-disc ml-6 text-black text-sm">
                  {prediction.probabilities.map((prob, index) => {
                    const label =
                      selectedClassificationModel === "METAVIR-AI"
                        ? `F${index}`
                        : ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
                            index
                          ];
                    return (
                      <li key={index}>
                        {label}: {prob.toFixed(4)}
                      </li>
                    );
                  })}
                </ul>

                {/* Gráfico de Probabilidades */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white">
                    Gráfico de Probabilidades
                  </h3>
                  <div className="mt-4">
                    <BarChart
                      probabilities={prediction.probabilities}
                      labels={
                        selectedClassificationModel === "METAVIR-AI"
                          ? ["F0", "F1", "F2", "F3", "F4"]
                          : [
                              "Sano",
                              "Esteatosis",
                              "Cirrosis",
                              "Hepatocarcinoma",
                            ]
                      }
                    />
                  </div>
                </div>

                {/* Botón para abrir la explicación en modal */}
                <button
                  className="predict-button mt-4 py-2 px-6 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 transition duration-300"
                  onClick={() => setShowModal(true)}
                >
                  Ver Explicación de los Resultados
                </button>

                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 relative">
                      <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-lg font-bold"
                        title="Cerrar"
                      >
                        ✕
                      </button>

                      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        Explicación Médica
                      </h2>

                      <div
                        className="prose prose-slate prose-sm md:prose-base max-w-none text-justify"
                        dangerouslySetInnerHTML={{ __html: htmlExplicacion }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : predict ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-yellow-400 rounded-lg shadow-inner bg-yellow-50">
                <svg
                  className="animate-spin h-10 w-10 text-yellow-500 mb-4"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <h3 className="text-xl font-semibold text-yellow-700">
                  Procesando imagen con IA...
                </h3>
                <p className="text-sm text-yellow-600 mt-2">
                  Esto puede tardar unos segundos. Por favor, espera.
                </p>
              </div>
            ) : null}
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
