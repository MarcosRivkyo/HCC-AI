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
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, storage } from "../../config/firebase.ts";
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
import { arrayUnion } from "firebase/firestore";

import NavbarSecond from "../UI/InsideNavbar.tsx";

import ProfileModal from "../UI/ProfileModal.tsx";
import SettingsModal from "../UI/SettingsModal.tsx";

import jsPDF from "jspdf";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import Assistant from "./Assistant.tsx";
import { FaEllipsisV, FaDownload, FaTrashAlt } from "react-icons/fa";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import EstudiosRecientesCompact from "../UI/RecentStudiesCompact.tsx";
import { useTranslation } from "react-i18next";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
  const { t, i18n } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [predict, setPredict] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(
    null,
  );
  const [showExplanationModal, setShowExplanationModal] = useState(false);

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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailToSend, setEmailToSend] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

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

  const [confirmarEliminacion, setConfirmarEliminacion] = useState<
    string | null
  >(null);

  // Use the existing handleEliminarEstudio for deletion
  const eliminarEstudio = async (id: string) => {
    try {
      // Aquí va tu lógica real de eliminación en Firestore
      await deleteDoc(doc(db, "hcc_ai_studies", id));
      toast.success("Estudio eliminado");
    } catch (err) {
      toast.error("Error al eliminar el estudio");
      console.error(err);
    }
  };

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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hcc_ai_users"));
        const allUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = allUsers.filter((u) => u.id !== user?.uid);
        setDoctorsList(filtered);
      } catch (error) {
        console.error("Error al obtener la lista de doctores:", error);
      }
    };

    if (user) {
      fetchDoctors();
    }
  }, [user]);

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

  const drawMarkdownParagraph = (
    pdf: jsPDF,
    text: string,
    x: number,
    yStart: number,
    maxWidth: number,
    lineHeight: number,
  ) => {
    const lines = text.split("\n");
    let y = yStart;

    lines.forEach((line) => {
      if (line.startsWith("* ")) {
        // Lista con viñeta
        pdf.setFont("helvetica", "bold");
        pdf.text("•", x, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(line.replace("* ", ""), x + 5, y);
        y += lineHeight;
      } else if (line.match(/^\*\*(.*?)\*\*/)) {
        // Título o subtítulo
        const cleaned = line.replace(/\*\*/g, "");
        pdf.setFont("helvetica", "bold");
        pdf.text(cleaned, x, y);
        pdf.setFont("helvetica", "normal");
        y += lineHeight;
      } else {
        // Texto normal
        const wrapped = pdf.splitTextToSize(line, maxWidth);
        wrapped.forEach((segment: string) => {
          pdf.text(segment, x, y);
          y += lineHeight;
        });
      }
    });

    return y;
  };

  const applyMarkdownLine = (
    pdf: jsPDF,
    line: string,
    x: number,
    y: number,
  ) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    let cursorX = x;

    const renderStyled = (text: string, style: string) => {
      if (style === "bold") pdf.setFont("helvetica", "bold");
      else if (style === "italic") pdf.setFont("helvetica", "italic");
      else pdf.setFont("helvetica", "normal");

      pdf.text(text, cursorX, y);
      const textWidth = pdf.getTextWidth(text);
      cursorX += textWidth;
    };

    // Procesar negrita primero
    const parts = line.split(boldRegex);
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // texto normal o con cursiva
        const inner = parts[i].split(italicRegex);
        for (let j = 0; j < inner.length; j++) {
          if (j % 2 === 0) renderStyled(inner[j], "normal");
          else renderStyled(inner[j], "italic");
        }
      } else {
        renderStyled(parts[i], "bold");
      }
    }
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
    let y = 20;

    // LOGO Y CABECERA
    try {
      const logoBase64 = await getImageAsBase64(logoHCC_AI);
      pdf.addImage(logoBase64, "PNG", (pageWidth - 40) / 2, y, 40, 20);
      y += 25;
    } catch {
      console.warn("No se pudo cargar el logo");
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(30, 30, 30);
    pdf.text("INFORME CLÍNICO - HCC-AI", pageWidth / 2, y, { align: "center" });
    y += 10;

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Estudio: ${estudio.studieName}`, pageWidth / 2, y, {
      align: "center",
    });
    y += 15;

    const drawSectionBox = (yStart: number, height: number, label: string) => {
      pdf.setDrawColor(200);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, yStart, pageWidth - 2 * margin, height);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(0);
      pdf.text(label.toUpperCase(), margin + 2, yStart + 6);
      return yStart + 12;
    };

    // DATOS DEL ESTUDIO
    y = drawSectionBox(y, 50, "Datos del Estudio");
    const generalInfo = [
      ["ID del Estudio", id],
      ["Estado", "Finalizado"],
      ["Fecha", estudio.studieDate.toDate().toLocaleString()],
      ["ID del Paciente", estudio.patientName],
      ["ID del Doctor", estudio.doctorName],
    ];
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    generalInfo.forEach(([label, val], i) => {
      pdf.text(`${label}:`, margin + 5, y + i * 7);
      pdf.text(`${val}`, margin + 65, y + i * 7);
    });
    y += generalInfo.length * 7 + 10;

    // DESCRIPCIÓN CLÍNICA
    if (estudio.clinicalDescription) {
      y = drawSectionBox(y, 40, "Descripción Clínica");
      const lines = pdf.splitTextToSize(
        estudio.clinicalDescription,
        pageWidth - 2 * margin - 10,
      );
      pdf.setFontSize(11);
      pdf.text(lines, margin + 5, y);
      y += lines.length * 6 + 10;
    }

    // IMÁGENES
    if (estudio.imagenUrl || segmentationUrl) {
      const imgSize = 67.7;
      const spacing = 10;
      const blockHeight = imgSize + 35; // altura extendida para títulos separados
      y = drawSectionBox(y, blockHeight, "Imágenes del Estudio");

      const x1 = (pageWidth - imgSize * 2 - spacing) / 2;
      const x2 = x1 + imgSize + spacing;

      const yTitles = y + 10; // espacio visual entre "Imágenes del Estudio" y títulos de imagen
      const yImg = yTitles + 6;

      // Subtítulos centrados sobre las imágenes
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(33);
      pdf.text("Ecografía Original", x1 + imgSize / 2, yTitles, {
        align: "center",
      });
      pdf.text("Ecografía Segmentada con IA", x2 + imgSize / 2, yTitles, {
        align: "center",
      });

      // Cargar imágenes
      const tryAddImage = async (url: string, x: number, yImg: number) => {
        try {
          const base64 = await getImageAsBase64(url);
          pdf.addImage(base64, "PNG", x, yImg, imgSize, imgSize);
        } catch {
          pdf.setFont("helvetica", "italic");
          pdf.setFontSize(10);
          pdf.setTextColor(200, 0, 0);
          pdf.text(
            "Error al cargar imagen",
            x + imgSize / 2,
            yImg + imgSize / 2,
            { align: "center" },
          );
        }
      };

      await tryAddImage(estudio.imagenUrl ?? "", x1, yImg);
      await tryAddImage(segmentationUrl, x2, yImg);

      y += blockHeight + 10;
    }

    // 7. ANÁLISIS IA — SIEMPRE EN UNA NUEVA PÁGINA
    if (predictionData?.predicted_class) {
      // Crear nueva página para el análisis
      pdf.addPage();
      let y = 20;
      let startY = y;
      const textWidth = pageWidth - 2 * margin;
      const lineHeight = 5; // más compacto
      const fontSize = 9;

      // Preparar clase predicha
      const claseMapeada =
        selectedClassificationModel === "HCC-AI"
          ? ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
              predictionData.predicted_class
            ]
          : `F${predictionData.predicted_class}`;

      const contenido = `**Clase predicha:** ${claseMapeada}\n\n${explicacionGenerada}`;

      // Dividir en líneas
      const explicacionLines = pdf.splitTextToSize(contenido, textWidth);

      let currentLine = 0;
      let pageStartY = y;

      while (currentLine < explicacionLines.length) {
        if (y + lineHeight > 285) {
          // dibujar recuadro antes de pasar página
          pdf.setDrawColor(180);
          pdf.rect(margin, pageStartY, textWidth, y - pageStartY + 5);

          pdf.addPage();
          y = 20;
          pageStartY = y;
        }

        if (y === pageStartY) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("ANÁLISIS DE IA", margin + 2, y + 6);
          y += 10;
        }

        // Dibujar línea
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSize);
        applyMarkdownLine(pdf, explicacionLines[currentLine], margin + 5, y);
        y += lineHeight;
        currentLine++;
      }

      // Dibujar recuadro final
      pdf.setDrawColor(180);
      pdf.rect(margin, pageStartY, textWidth, y - pageStartY + 5);
    }

    // FOOTER
    const pageCount = pdf.getNumberOfPages();
    const fecha = new Date().toLocaleString();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(100);

      // Texto de pie de página
      pdf.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 30, 290);
      pdf.text(`Generado: ${fecha}`, margin, 290);

      // Logo pequeño centrado
      const logoWidth = 12;
      const logoHeight = 6;
      const centerX = (pageWidth - logoWidth) / 2;
      const logoY = 286; // un poco por encima del borde inferior

      try {
        const logoBase64 = await getImageAsBase64(logoHCC_AI);
        pdf.addImage(logoBase64, "PNG", centerX, logoY, logoWidth, logoHeight);
      } catch {
        console.warn("No se pudo renderizar el logo en el footer");
      }
    }

    // SUBIR A FIREBASE
    const pdfBlob = pdf.output("blob");
    const folderPath =
      userData.documentFolder || `HCC-AI/users/${user.uid}/documents`;
    const pdfFileName = `informe_${id}.pdf`;
    const pdfRef = ref(storage, `${folderPath}/${pdfFileName}`);

    try {
      await uploadBytesResumable(pdfRef, pdfBlob);
      const downloadURL = await getDownloadURL(pdfRef);
      if (id) {
        const docRef = doc(db, "hcc_ai_studies", id);
        await updateDoc(docRef, { pdfReportUrl: downloadURL });
        setEstudio((prev) => ({ ...prev!, pdfReportUrl: downloadURL }));
      }
      console.log("PDF subido y URL guardada correctamente:", downloadURL);
    } catch (err) {
      console.error("Error al subir el PDF:", err);
    }
  };

  const enviarPDFporCorreo = () => {
    if (!estudio?.pdfReportUrl) {
      alert("Primero debes generar el informe PDF.");
      return;
    }
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!emailToSend || !emailToSend.includes("@")) {
      toast.error("Correo electrónico inválido.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send-report`,
        {
          name: userData?.firstName || user.displayName || "Médico HCC-AI",
          email: emailToSend,
          message: `Te comparto el informe clínico del estudio "${estudio?.studieName ?? ""}". Puedes descargarlo aquí:\n\n${estudio?.pdfReportUrl ?? ""}`,
        },
      );

      if (response.status === 200) {
        toast.success("Informe enviado correctamente.");
        setShowEmailModal(false);
        setEmailToSend("");
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

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        },
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
        },
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
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex flex-col text-gray-800 dark:text-gray-100">
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
        theme={theme === "dark" ? "dark" : "light"}
        toastClassName={() =>
          `rounded-lg border border-black shadow-md px-4 py-3 text-sm ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          }`
        }
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
        <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40">
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
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
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

          {/* FILA 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 dark:bg-gray-800">
            {/* Columna izquierda: datos */}
            <div className="bg-white rounded-xl p-6 space-y-4 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 w-full dark:text-white">
                    {estudio?.studieName}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-white">
                    {t("my_studies.id_study")}: {id}
                  </p>
                </div>
                <p
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    estudio?.status === "Finalizado"
                      ? "bg-green-100 text-green-800"
                      : estudio?.status === "En Progreso"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {estudio?.status === "Finalizado"
                    ? t("my_studies.status_done")
                    : estudio?.status === "En Progreso"
                      ? t("my_studies.status_in_progress")
                      : estudio?.status}
                </p>
              </div>

              <p className="text-sm text-gray-400 mb-1">
                {estudio?.studieDate?.toDate().toLocaleString(i18n.language, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="text-gray-700 mb-1 dark:text-white">
                <strong>{t("my_studies.doctor_name")}:</strong>{" "}
                {estudio?.doctorName ?? "Desconocido"}
              </p>

              <p className="text-gray-700 mb-4 dark:text-white">
                <strong>{t("my_studies.patient_name")}:</strong>{" "}
                {estudio?.patientName}
              </p>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1 dark:text-white">
                  {t("my_studies.clinical_description")}
                </h2>
                <p className="text-gray-600 dark:text-white">
                  {estudio?.clinicalDescription}
                </p>
              </div>
            </div>

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
                className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] border-2 border-dashed border-gray-400 rounded-xl relative bg-gray-50 dark:bg-black overflow-hidden flex items-center justify-center"
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
                      {t("my_studies.upload_image")}
                    </div>
                  ) : estudio?.imagenUrl ? (
                    <img
                      src={estudio.imagenUrl}
                      alt="Imagen del estudio"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-center">
                      {t("my_studies.drag_or_drop")}
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      estudio?.predictionId ? undefined : handleImagenChange(e)
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
              <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md w-auto">
                {/* Descargar */}
                <button
                  onClick={descargarPDF}
                  title="Descargar informe"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <FaDownload className="text-gray-700 dark:text-white" />
                </button>

                {/* Enviar por correo */}
                <button
                  onClick={enviarPDFporCorreo}
                  title="Enviar por correo"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700 dark:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.5 3h-9A2.5 2.5 0 005 5.5v13A2.5 2.5 0 007.5 21h9a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0016.5 3zM7 7l5 3.5L17 7"
                    />
                  </svg>
                </button>

                {/* Compartir */}
                <button
                  onClick={() => setShowShareModal(true)}
                  title="Compartir estudio"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700 dark:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 8a3 3 0 100-6 3 3 0 000 6zM9 20a3 3 0 100-6 3 3 0 000 6zM20.24 14.83A4.992 4.992 0 0018 15h-1.26A6.978 6.978 0 0012 17c-1.47 0-2.83-.44-3.96-1.17l-.22.22a2.992 2.992 0 01-4.24 0 3.002 3.002 0 010-4.24 2.992 2.992 0 014.24 0l.22.22A6.978 6.978 0 0012 11c1.47 0 2.83.44 3.96 1.17L18 10h1.26a4.992 4.992 0 001.98-.39z"
                    />
                  </svg>
                </button>

                {/* Eliminar */}
                <button
                  onClick={() => setConfirmarEliminacion(id ?? null)}
                  title="Eliminar estudio"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 transition"
                >
                  <FaTrashAlt className="text-white" />
                </button>
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
                {t("my_studies.start_analysis")}
              </button>
            </div>
          )}

          {/* Mostrar los parámetros del análisis */}
          {parametersVisible && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">
                {t("my_studies.choose_parameters")}
              </h3>

              {/* Modelo de Clasificación */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2 dark:text-white">
                  {t("my_studies.classification_models")}
                </label>
                <div className="flex gap-4">
                  {[
                    {
                      name: "HCC-AI",
                      description: t("my_studies.hcc_ai_description"),
                    },
                    {
                      name: "METAVIR-AI",
                      description: t("my_studies.metavir_ai_description"),
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
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                      {t("my_studies.metavir_submodels")}
                    </label>
                    <select
                      value={selectedSubModel}
                      onChange={(e) => setSelectedSubModel(e.target.value)}
                      className="block w-full px-3 py-2 border dark:text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">
                        {t("my_studies.choose_submodel")}
                      </option>
                      <option value="resnet">ResNet</option>
                      <option value="VGG16">VGG16</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Modelo de Segmentación */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2 dark:text-white">
                  {t("my_studies.segmentation_models")}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                          {t("my_studies.segmentation_submodels")}
                        </label>
                        <select
                          value={selectedSegmentationSubModel}
                          onChange={(e) =>
                            setSelectedSegmentationSubModel(e.target.value)
                          }
                          className="block dark:text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">
                            {t("my_studies.choose_submodel")}
                          </option>
                          <option value="YOLOv8">YOLOv8</option>
                          <option value="YOLOv11">YOLOv11</option>
                        </select>
                      </div>

                      {/* Umbral de Confianza */}
                      <div>
                        <label
                          htmlFor="confidenceThreshold"
                          className="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
                        >
                          {t("my_studies.minimum_threshold")} (%)
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
                          className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-300">
                          {t("my_studies.threshold_explanation")}
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
                    className="text-sm text-gray-700 dark:text-white"
                  >
                    {t("my_studies.generate_ai_explanation")}
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
                  {t("my_studies.start_prediction")}
                </button>
              </div>
            </div>
          )}
          {/* Lado derecho: Resultados */}
          <div className="flex-1 p-8">
            {segmentation && prediction ? (
              <div className="result-display p-6 rounded-lg border-2 border-dashed">
                {/* Modelos utilizados */}
                <div className="mt-8 bg-gray-100 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm dark:bg-gray-900">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2 dark:text-blue-300">
                    {t("my_studies.used_parameters")}
                  </h4>
                  <ul className="text-sm text-gray-700 leading-6 dark:text-gray-200">
                    <li>
                      <strong>{t("my_studies.classification_models")}:</strong>{" "}
                      {selectedClassificationModel}
                      {selectedClassificationModel === "METAVIR-AI" &&
                        selectedSubModel && <span> ({selectedSubModel})</span>}
                    </li>
                    <li>
                      <strong>{t("my_studies.segmentation_models")}:</strong>{" "}
                      {selectedSegmentationModel}
                      {selectedSegmentationModel === "SegmentadorHepático-AI" &&
                        selectedSegmentationSubModel && (
                          <span> ({selectedSegmentationSubModel})</span>
                        )}
                    </li>
                    <li>
                      <strong>{t("my_studies.minimum_threshold")}:</strong>{" "}
                      {Math.round(confidenceThreshold * 100)}%
                    </li>
                  </ul>
                </div>

                {/* Imagen Segmentada */}
                <h3 className="text-xl mt-10 font-semibold text-black dark:text-white">
                  {t("editor.segmented_image")}:
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
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                          {t("my_studies.tags_list")}
                        </h3>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li>
                            <strong>HCC</strong>:{" "}
                            {t("my_studies.segmented_structures.HCC")}
                          </li>
                          <li>
                            <strong>HV</strong>:
                            {t("my_studies.segmented_structures.HV")}
                          </li>
                          <li>
                            <strong>IVC</strong>:{" "}
                            {t("my_studies.segmented_structures.IVC")}
                          </li>
                          <li>
                            <strong>K</strong>:{" "}
                            {t("my_studies.segmented_structures.K")}
                          </li>
                          <li>
                            <strong>K-C</strong>:{" "}
                            {t("my_studies.segmented_structures.K-C")}
                          </li>
                          <li>
                            <strong>K-M</strong>:{" "}
                            {t("my_studies.segmented_structures.K-M")}
                          </li>
                          <li>
                            <strong>TRANS</strong>:{" "}
                            {t("my_studies.segmented_structures.TRANS")}
                          </li>
                          <li>
                            <strong>LVR</strong>:{" "}
                            {t("my_studies.segmented_structures.LVR")}
                          </li>
                          <li>
                            <strong>PV</strong>:{" "}
                            {t("my_studies.segmented_structures.PV")}
                          </li>
                          <li>
                            <strong>SAG</strong>:{" "}
                            {t("my_studies.segmented_structures.SAG")}
                          </li>
                          <li>
                            <strong>SAG K</strong>:{" "}
                            {t("my_studies.segmented_structures.SAG K")}
                          </li>
                          <li>
                            <strong>LT SAG</strong>:{" "}
                            {t("my_studies.segmented_structures.LT SAG")}
                          </li>
                          <li>
                            <strong>RT TRANS</strong>:{" "}
                            {t("my_studies.segmented_structures.RT TRANS")}
                          </li>
                        </ul>
                        <button
                          onClick={() => setShowLegendModal(false)}
                          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                        >
                          {t("actions.close")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clasificación Predicha */}
                <h3 className="mt-8 text-xl font-semibold text-white"></h3>
                <div className="flex justify-center items-center gap-2 mt-8">
                  <p className="text-2xl font-bold text-blue-500">
                    {t("my_studies.predicted_class")}:{" "}
                    {selectedClassificationModel === "METAVIR-AI"
                      ? `F${prediction.predicted_class}`
                      : ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
                          prediction.predicted_class
                        ]}
                  </p>
                  <button
                    onClick={() => setShowExplanationModal(true)}
                    title="Ver explicación"
                    className="w-7 h-7 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center hover:bg-blue-700"
                  >
                    ?
                  </button>
                </div>
                {showExplanationModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-xl relative space-y-4">
                      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                        Probabilidades de cada clase:
                      </h2>

                      {(selectedClassificationModel === "HCC-AI"
                        ? ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"]
                        : ["F0", "F1", "F2", "F3", "F4"]
                      ).map((label, index) => {
                        const prob = prediction.probabilities[index] || 0;
                        const percentage = (prob * 100).toFixed(2);

                        // Mismos colores para ambos modelos
                        const colorPalette = [
                          {
                            border: "border-green-600",
                            icon: "🟢",
                            text: "text-green-700",
                            stroke: "stroke-green-600",
                          },
                          {
                            border: "border-yellow-400",
                            icon: "🟡",
                            text: "text-yellow-600",
                            stroke: "stroke-yellow-400",
                          },
                          {
                            border: "border-orange-500",
                            icon: "🟠",
                            text: "text-orange-600",
                            stroke: "stroke-orange-500",
                          },
                          {
                            border: "border-red-600",
                            icon: "🔴",
                            text: "text-red-600",
                            stroke: "stroke-red-600",
                          },
                          {
                            border: "border-red-800",
                            icon: "🔴",
                            text: "text-red-800",
                            stroke: "stroke-red-800",
                          },
                        ];

                        const explicaciones =
                          selectedClassificationModel === "HCC-AI"
                            ? [
                                "El hígado tiene una apariencia normal sin signos de daño estructural ni acumulación de grasa. Función hepática conservada. Riesgo bajo.",
                                "Se observa acumulación de grasa en el hígado (hígado graso), común en personas con obesidad, diabetes o consumo elevado de alcohol. Aunque puede ser reversible, puede evolucionar si no se trata. Riesgo medio.",
                                "El hígado muestra cicatrices y nódulos regenerativos debido a daño crónico. Esto limita su función y puede conllevar complicaciones como hipertensión portal o insuficiencia hepática. Riesgo alto.",
                                "Se detecta una masa compatible con un tumor maligno primario del hígado. Puede haber sospecha fuerte de hepatocarcinoma (HCC). Requiere evaluación inmediata por un especialista. Riesgo muy alto.",
                              ]
                            : [
                                "No hay signos de fibrosis. El tejido hepático se conserva íntegro. Riesgo bajo.",
                                "Fibrosis leve en áreas portales, sin afectación de la arquitectura hepática general. Puede ser reversible. Riesgo bajo-medio.",
                                "Fibrosis moderada con tabiques entre áreas portales. Señal de progresión. Puede evolucionar si no se trata. Riesgo medio.",
                                "Fibrosis avanzada con puentes fibrosos extensos. El hígado comienza a perder funcionalidad. Riesgo alto.",
                                "Cirrosis: distorsión severa del tejido hepático y pérdida significativa de la función. Puede conllevar a HCC o insuficiencia hepática. Riesgo muy alto.",
                              ];

                        const color = colorPalette[index];

                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-4 border-l-8 ${color.border} bg-white dark:bg-gray-800 rounded-lg shadow p-4`}
                          >
                            {/* Porcentaje circular */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle
                                  className="text-gray-300"
                                  strokeWidth="6"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="40"
                                  cx="48"
                                  cy="48"
                                />
                                <circle
                                  className={`${color.stroke} transition-all duration-1000 ease-out`}
                                  strokeWidth="6"
                                  strokeDasharray="251.2"
                                  strokeDashoffset={251.2 * (1 - prob)}
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="40"
                                  cx="48"
                                  cy="48"
                                />
                              </svg>
                              <span className="relative z-10 text-base font-bold text-gray-800 dark:text-white">
                                {percentage}%
                              </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-1">
                              <p
                                className={`font-semibold ${color.text} text-lg`}
                              >
                                {color.icon} {label}
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {explicaciones[index]}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setShowExplanationModal(false)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-lg text-black dark:text-white">
                  {t("my_studies.class_probabilities")}:
                </p>

                {/* Gráfico de Probabilidades */}
                <div className="mt-6">
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
                      theme={localStorage.getItem("theme") || "light"}
                    />
                  </div>
                </div>

                {explicacionGenerada && (
                  <div className="mt-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                      {t("my_studies.medical_explanation")}
                    </h2>

                    <div
                      className="prose dark:prose-invert max-w-none text-justify text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: htmlExplicacion }}
                    />
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
                  {t("my_studies.processing_image")}
                </h3>
                <p className="text-sm text-yellow-600 mt-2">
                  {t("my_studies.may_take_time")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Enviar informe por correo
            </h2>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Correo del destinatario:
            </label>
            <input
              type="email"
              value={emailToSend}
              onChange={(e) => setEmailToSend(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:text-white"
            />

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Compartir estudio con otro doctor
            </h2>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Selecciona un doctor:
            </label>

            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:text-white"
            >
              <option value="">-- Seleccionar --</option>
              {doctorsList.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName} ({doctor.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!selectedDoctorId || !id) return;

                  try {
                    const estudioRef = doc(db, "hcc_ai_studies", id);
                    await updateDoc(estudioRef, {
                      sharedWithDoctorIds: arrayUnion(selectedDoctorId),
                    });
                    toast.success("Estudio compartido correctamente");
                    setShowShareModal(false);
                  } catch (error) {
                    console.error("Error al compartir estudio:", error);
                    toast.error("Error al compartir el estudio");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmarEliminacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {t("my_studies.delete_title")}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {t("my_studies.delete_warning")}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  eliminarEstudio(confirmarEliminacion);
                  setConfirmarEliminacion(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
              >
                {t("dashboard.delete")}
              </button>
              <button
                onClick={() => setConfirmarEliminacion(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                {t("dashboard.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white text-center p-4 w-full mt-auto shadow-lg rounded-t-lg mb-0">
        © 2025 HCC-AI
      </footer>
    </div>
  );
};

export default EstudioDetalle;
