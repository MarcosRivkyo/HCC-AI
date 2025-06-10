// src/viewmodels/useDetailedStudyViewModel.ts
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthDAO } from "../data/dao/AuthDAO";
import { UserDAO } from "../data/dao/UserDAO";
import { StudyDAO } from "../data/dao/StudyDAO";
import { FileDAO } from "../data/dao/FileDAO";

import { toast, ToastContainer } from "react-toastify";
import { getAuth } from "firebase/auth";

import { marked } from "marked";
import jsPDF from "jspdf";
import logoHCC_AI from "../assets/images/logo_hcc_ai.jpg";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import { Timestamp } from "firebase/firestore";

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
  doctorId?: string;
  patientId?: string;
  sharedWithDoctorIds?: string[];
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

export const useEstudioDetalleViewModel = () => {
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
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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
  const isPatient = userData?.rol === "Paciente";
  const chartRef = useRef(null);
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

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = AuthDAO.subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userData = await UserDAO.getUserById(currentUser.uid);

          if (userData) {
            setUserData(userData);
          } else {
            console.log("No se encontró el documento del usuario.");
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const estudioData = await StudyDAO.fetchEstudioDetalle(id);

        if (estudioData) {
          setEstudio(estudioData);
          setEditedEstudio(estudioData);
        } else {
          console.log("Estudio no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener estudio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  useEffect(() => {
    if (!estudio || !userData) return;

    const isDoctor = estudio.doctorId === user?.uid;
    const isPatient = estudio.patientId === user?.uid;
    const isShared = estudio.sharedWithDoctorIds?.includes(user?.uid);

    if (!isDoctor && !isPatient && !isShared) {
      toast.error("No tienes permiso para ver este estudio.");
      navigate("/dashboard");
    }
  }, [estudio, userData]);

  useEffect(() => {
    const fetchPredictionData = async () => {
      if (!estudio?.predictionId) return;

      try {
        const predictionData = await StudyDAO.fetchPrediction(
          estudio.predictionId,
        );
        if (!predictionData) return;

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
          setSelectedSegmentationSubModel(predictionData.segmentationSubModel);

        if (predictionData.confidenceThreshold)
          setConfidenceThreshold(predictionData.confidenceThreshold);

        if (predictionData.explanation) {
          setExplicacionGenerada(predictionData.explanation);
          const html = await marked.parse(predictionData.explanation);
          setHtmlExplicacion(html);
        }
      } catch (error) {
        console.error("Error al cargar predicción:", error);
      }
    };

    fetchPredictionData();
  }, [estudio]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user?.uid) return;

      const doctors = await UserDAO.getAllDoctors(user.uid);
      setDoctorsList(doctors);
    };

    fetchDoctors();
  }, [user]);

  const eliminarEstudio = async (id: string) => {
    try {
      await StudyDAO.deleteStudyWithPrediction(id);
      navigate("/dashboard");
      toast.success("Estudio eliminado");
    } catch (err) {
      toast.error("Error al eliminar el estudio");
      console.error(err);
    }
  };

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

  const guardarDocumento = async (pdfUrl: string) => {
    try {
      await FileDAO.saveDocumentRecord({
        pdfUrl: pdfUrl,
        estudioId: id!,
        pacienteId: estudio?.patientId || "Paciente desconocido",
        doctorId: estudio?.doctorId || "Doctor desconocido",
      });

      console.log("Documento guardado en hcc_ai_documents");
    } catch (error) {
      console.error("Error al guardar documento:", error);
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
      [
        "Fecha",
        (estudio.studieDate?.toDate
          ? estudio.studieDate.toDate()
          : new Date(estudio.studieDate)
        ).toLocaleString(),
      ],
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
    if (
      predictionData?.predicted_class !== undefined &&
      predictionData?.predicted_class !== null
    ) {
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

    try {
      const downloadURL = await FileDAO.uploadPdfReport({
        pdfBlob,
        folderPath,
        fileName: pdfFileName,
        studyId: id!,
      });

      setEstudio((prev) => ({ ...prev!, pdfReportUrl: downloadURL }));
      await guardarDocumento(downloadURL);

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

    setIsSendingEmail(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send-report`,
        {
          name: userData?.firstName || user.displayName || "Médico HCC-AI",
          email: emailToSend,
          message: `Te comparto el informe clínico del estudio "${estudio?.studieName ?? ""}".\n\nPuedes descargar el PDF directamente aquí:\n${estudio?.pdfReportUrl ?? ""}\n\nO bien, si deseas verlo desde la aplicación, pulsa en el siguiente enlace e inicia sesión con tu cuenta:\nhttps://hcc-ai.vercel.app//estudio/${id}`,
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
    } finally {
      setIsSendingEmail(false); // 🔁 Restablecer botón
    }
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
    const nuevoNombre = editedEstudio?.studieName?.trim();

    if (!nuevoNombre) {
      toast.error("El nombre del estudio no puede estar vacío.");
      return;
    }

    const nombreDuplicado = await StudyDAO.isStudyNameDuplicate(
      nuevoNombre,
      id,
    );
    if (nombreDuplicado) {
      toast.error(
        "Ya existe un estudio con ese nombre. Por favor, elige otro.",
      );
      return;
    }

    try {
      const rawDate = editedEstudio?.studieDate;

      let finalDate: Date | null = null;

      if (rawDate instanceof Timestamp) {
        finalDate = rawDate.toDate();
      } else if (rawDate instanceof Date) {
        finalDate = rawDate;
      } else if (typeof rawDate === "string") {
        const temp = new Date(rawDate);
        if (!isNaN(temp.getTime())) {
          finalDate = temp;
        }
      }

      await StudyDAO.updateStudy(id!, {
        studieName: nuevoNombre,
        patientName: editedEstudio?.patientName,
        clinicalDescription: editedEstudio?.clinicalDescription,
        studieDate: finalDate,
      });

      toast.success("Estudio actualizado correctamente.");
      setEstudio(editedEstudio);
      setEditing(false);
    } catch (error) {
      console.error("Error al guardar estudio:", error);
      toast.error("Hubo un error al guardar los cambios.");
    }
  };

  const procesarImagen = async (file: File, tipo: "ecografias" | "mask") => {
    setImagenSeleccionada(file);
    resizeImage(file);
    setSubiendoImagen(true);

    const userId = user.uid;
    const folderPath = userData.imageFolder || `HCC-AI/users/${userId}/images`;
    const generatedFileName = `${uuidv4()}_${file.name}`;
    setFileName(generatedFileName);

    try {
      const downloadURL = await FileDAO.uploadStudyImage({
        file,
        fileName: generatedFileName,
        tipo,
        userId,
        folderPath,
        studyId: id!,
        predictionId: estudio?.predictionId || null,
      });

      if (tipo === "ecografias") {
        setEstudio((prev) => ({ ...prev!, imagenUrl: downloadURL }));
      } else if (tipo === "mask") {
        setEstudio((prev) => ({ ...prev!, maskUrl: downloadURL }));
      }

      setSubiendoImagen(false);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setSubiendoImagen(false);
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarImagen(file, "ecografias");
      setImagenSeleccionada(file);
    }
  };

  const handleEliminarEcografia = async () => {
    if (!estudio?.imagenUrl) return;

    try {
      const userId = user.uid;
      const folderPath =
        userData.imageFolder || `HCC-AI/users/${userId}/images`;

      await FileDAO.deleteStudyImage({
        imageUrl: estudio.imagenUrl,
        userId,
        folderPath,
        studyId: id!,
      });

      setEstudio((prev) => ({
        ...prev!,
        imagenUrl: null,
      }));

      alert("Ecografía eliminada correctamente");
    } catch (error) {
      alert("Error al eliminar la ecografía");
    }
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
  const handleDownloadChart = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = `grafico_${selectedClassificationModel}_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const actualizarImagenConPrediccion = async (
    imagenUrl: string,
    predictionId: string,
    clasePredicha: number,
    modeloClasificacion: string,
  ) => {
    try {
      await FileDAO.updateImageWithPrediction({
        imageUrl: imagenUrl,
        predictionId,
        predictedClass: clasePredicha,
        model: modeloClasificacion,
      });
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
    }
  };

  const toLocalDatetimeInputValue = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleShareStudy = async () => {
    if (!selectedDoctorId || !id) return;

    const doctor = doctorsList
      .filter((d) => d.rol === "Médico" || d.rol === "Administrador")
      .find((d) => d.id === selectedDoctorId);

    if (!doctor?.email) {
      toast.error("No se encontró el correo del doctor.");
      return;
    }

    try {
      // 1. Compartir en Firestore con DAO
      await StudyDAO.shareStudyWithDoctor(id, selectedDoctorId);

      // 2. Enviar correo
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send-report`,
        {
          name: userData?.firstName || user.displayName || "Médico HCC-AI",
          email: doctor.email,
          message: `Estudio: "${estudio?.studieName ?? "sin nombre"}"`,
        },
      );

      if (response.status === 200) {
        toast.success("Estudio compartido y correo enviado.");
      } else {
        toast.warning("Estudio compartido, pero el correo no pudo enviarse.");
      }

      setShowShareModal(false);
    } catch (error) {
      console.error("Error al compartir o enviar correo:", error);
      toast.error("Error al compartir el estudio o enviar el correo.");
    }
  };

  const iniciarPrediccionIA = async () => {
    if (!id) return;

    setPredict(true);

    const formData = new FormData();
    const userId = user.uid;
    const folderPath = userData.imageFolder || `HCC-AI/users/${userId}/images`;
    const fileToUse = imagenSeleccionada
      ? imagenSeleccionada
      : await fetch(estudio!.imagenUrl!)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new File([blob], "imagen_estudio.png", { type: blob.type }),
          );

    formData.append("file", fileToUse);
    formData.append("model_name", selectedSubModel);

    try {
      setParametersVisible(false);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      // Paso 1: Clasificación
      const predictionResponse = await axios.post<PredictionResponse>(
        `${backendUrl}/predict-classification/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setPrediction(predictionResponse.data);
      setProgress(100);
      setTimeout(() => setProgress(5), 3000);

      // Paso 2: Segmentación
      const segmentationResponse = await axios.post(
        `${backendUrl}/segment/?confidence_threshold=${confidenceThreshold.toFixed(2)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const { image_base64, detected_labels, confidence_threshold } =
        segmentationResponse.data;
      const imageBlob = await fetch(
        `data:image/jpeg;base64,${image_base64}`,
      ).then((res) => res.blob());
      const fileNameFinal = `masked_${fileName}.png`;

      const maskUrl = await FileDAO.uploadMaskImage(
        imageBlob,
        folderPath,
        fileNameFinal,
      );
      setSegmentation({ segmented_image_url: maskUrl });

      // Paso 3: Explicación
      const claseMapeada =
        selectedClassificationModel === "HCC-AI"
          ? ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
              predictionResponse.data.predicted_class
            ]
          : `F${predictionResponse.data.predicted_class}`;

      const explicacion = usarExplicacionIA
        ? await explicarResultadoConIA(claseMapeada, detected_labels)
        : "No se generó una explicación automática (opción desactivada).";

      setExplicacionGenerada(explicacion);
      setHtmlExplicacion(await marked.parse(explicacion));

      // Paso 4: Guardar predicción en Firestore
      const predictionId = await StudyDAO.savePrediction({
        predicted_class: predictionResponse.data.predicted_class,
        probabilities: predictionResponse.data.probabilities,
        maskUrl,
        classificationModel: selectedClassificationModel,
        classificationSubModel: selectedSubModel,
        segmentationModel: selectedSegmentationModel,
        segmentationSubModel: selectedSegmentationSubModel,
        confidenceThreshold,
        explanation: explicacion,
      });

      await FileDAO.saveMaskMetadata({
        imageUrl: maskUrl,
        estudioId: id,
        doctorId: user.uid,
        predictionId,
        sizeKB: Math.round(imageBlob.size / 1024),
        predictedClass: predictionResponse.data.predicted_class,
      });

      await StudyDAO.linkPredictionToStudy(id, predictionId);

      if (estudio?.imagenUrl) {
        await FileDAO.updateImageWithPrediction({
          imageUrl: estudio.imagenUrl,
          predictionId,
          predictedClass: predictionResponse.data.predicted_class,
          model: selectedClassificationModel,
        });
      }

      setEstudio((prev) => ({
        ...prev!,
        resultadoIA: predictionResponse.data.predicted_class,
        probabilities: predictionResponse.data.probabilities,
        maskUrl,
        status: "Finalizado",
        predictionId,
      }));

      await generarPDF(predictionResponse.data, maskUrl, explicacion);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      alert("Ocurrió un error al procesar la imagen.");
    } finally {
      setPredict(false);
    }
  };

  return {
    estudio,
    setEstudio,
    selectedSubModel,
    setSelectedSubModel,
    loading,
    setLoading,
    subiendoImagen,
    setSubiendoImagen,
    predict,
    setPredict,
    user,
    setUser,
    userData,
    setUserData,
    imagenSeleccionada,
    setImagenSeleccionada,
    showExplanationModal,
    setShowExplanationModal,
    isSendingEmail,
    setIsSendingEmail,
    imagenRedimensionada,
    setImagenRedimensionada,
    isProfileOpen,
    setIsProfileOpen,
    selectedSegmentationSubModel,
    setSelectedSegmentationSubModel,
    confidenceThreshold,
    setConfidenceThreshold,
    htmlExplicacion,
    setHtmlExplicacion,
    editing,
    setEditing,
    editedEstudio,
    setEditedEstudio,
    parametersVisible,
    setParametersVisible,
    showAssistant,
    setShowAssistant,
    selectedClassificationModel,
    setSelectedClassificationModel,
    selectedSegmentationModel,
    setSelectedSegmentationModel,
    showLegendModal,
    setShowLegendModal,
    prediction,
    setPrediction,
    segmentation,
    setSegmentation,
    explicacionGenerada,
    setExplicacionGenerada,
    progress,
    setProgress,
    showModal,
    setShowModal,
    usarExplicacionIA,
    setUsarExplicacionIA,
    showEmailModal,
    setShowEmailModal,
    emailToSend,
    setEmailToSend,
    showShareModal,
    setShowShareModal,
    doctorsList,
    setDoctorsList,
    selectedDoctorId,
    setSelectedDoctorId,
    fileName,
    setFileName,
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
    mostrarEstudiosRecientes,
    setMostrarEstudiosRecientes,
    confirmarEliminacion,
    setConfirmarEliminacion,
    isPatient,
    chartRef,
    eliminarEstudio,
    getImageAsBase64,
    descargarPDF,
    applyMarkdownLine,
    generarPDF,
    handleCancelEdit,
    resizeImage,
    enviarPDFporCorreo,
    handleSendEmail,
    handleInputChange,
    handleSaveChanges,
    procesarImagen,
    handleImagenChange,
    handleEliminarEcografia,
    handleDrop,
    explicarResultadoConIA,
    actualizarImagenConPrediccion,
    handleDownloadChart,
    toLocalDatetimeInputValue,
    handleShareStudy,
    iniciarPrediccionIA,
  };
};
