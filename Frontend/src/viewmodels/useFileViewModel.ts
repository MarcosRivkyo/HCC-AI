// src/viewmodels/useFilesViewModel.ts

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileItem } from "../models/File";
import { FileDAO } from "../data/dao/FileDAO";

export const useFilesViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [groupedFiles, setGroupedFiles] = useState<Record<string, FileItem[]>>(
    {},
  );
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [fileToDelete, setFileToDelete] = useState<{
    folderPath: string;
    fileName: string;
  } | null>(null);
  const [folderPages, setFolderPages] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showAssistant, setShowAssistant] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [imageInfo, setImageInfo] = useState<any | null>(null);
  const [documentInfo, setDocumentInfo] = useState<any | null>(null);
  const [imageInfoOpen, setImageInfoOpen] = useState(false);
  const [documentInfoOpen, setDocumentInfoOpen] = useState(false);

  useEffect(() => {
    FileDAO.getCurrentUser().then(async (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await FileDAO.getUserData(currentUser.uid);
        setUserData(data);
      }
    });
  }, []);

  const fetchAllFiles = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      const fileGroups: Record<string, FileItem[]> = {};
      const subfolders = ["ecografias", "masks"];
      for (const sub of subfolders) {
        const fullPath = `${userData.imageFolder}${sub}/`;
        fileGroups[sub] = await FileDAO.listFiles(fullPath);
      }

      if (userData.documentFolder) {
        fileGroups["informes"] = await FileDAO.listFiles(
          userData.documentFolder,
        );
      }

      setGroupedFiles(fileGroups);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
    setFolderPages((prev) => ({ ...prev, [folderName]: 1 }));
  };

  const changePage = (folderName: string, direction: "next" | "prev") => {
    setFolderPages((prev) => {
      const currentPage = prev[folderName] || 1;
      return {
        ...prev,
        [folderName]: Math.max(
          direction === "next" ? currentPage + 1 : currentPage - 1,
          1,
        ),
      };
    });
  };

  const handleUpload = async (folderPath: string, file: File) => {
    if (!file || !user) return;
    FileDAO.uploadFile(
      folderPath,
      file,
      async () => {
        await fetchAllFiles();
        toast.success(`Archivo "${file.name}" subido con éxito`);
      },
      (err) => {
        console.error("Upload error:", err);
        toast.error("Error al subir archivo");
      },
    );
  };

  const handleImageClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/editar-imagen?imageUrl=${encodeURIComponent(url)}`);
  };

  const confirmarEliminarArchivo = async () => {
    if (!fileToDelete) return;
    try {
      await FileDAO.deleteFile(fileToDelete.folderPath, fileToDelete.fileName);
      await fetchAllFiles();
      toast.success(`Archivo "${fileToDelete.fileName}" eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      toast.error("No se pudo eliminar el archivo");
    } finally {
      setFileToDelete(null);
    }
  };

  const handleOpenImageInfo = async (imageUrl: string) => {
    try {
      const data = await FileDAO.getImageInfoByUrl(imageUrl);
      if (data) {
        setImageInfo(data);
        setImageInfoOpen(true);
      } else {
        toast.warn("No se encontró información para esta imagen.");
      }
    } catch (err) {
      console.error("Error al buscar info de imagen:", err);
      toast.error("Error al obtener información de la imagen.");
    }
  };

  const handleOpenDocumentInfo = async (pdfUrl: string) => {
    try {
      const data = await FileDAO.getDocumentInfoByUrl(pdfUrl);
      if (data) {
        setDocumentInfo(data);
        setDocumentInfoOpen(true);
      } else {
        toast.warn("No se encontró información para este informe.");
      }
    } catch (err) {
      console.error("Error al buscar info del informe:", err);
      toast.error("Error al obtener información del informe.");
    }
  };

  return {
    user,
    userData,
    groupedFiles,
    openFolders,
    fileToDelete,
    folderPages,
    loading,
    showAssistant,
    isProfileOpen,
    isSettingsOpen,
    theme,
    language,
    scale,
    highContrast,
    imageInfo,
    documentInfo,
    imageInfoOpen,
    documentInfoOpen,

    setShowAssistant,
    setIsProfileOpen,
    setIsSettingsOpen,
    setTheme,
    setLanguage,
    setScale,
    setHighContrast,

    fetchAllFiles,
    toggleFolder,
    changePage,
    handleImageClick,
    setFileToDelete,
    confirmarEliminarArchivo,
    handleOpenImageInfo,
    handleOpenDocumentInfo,
    setDocumentInfoOpen,
    setImageInfoOpen,
    setDocumentInfo,
  };
};
