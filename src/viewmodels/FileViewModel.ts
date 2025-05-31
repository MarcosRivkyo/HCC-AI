// viewModels/FilesViewModel.ts
import { useEffect, useState } from "react";
import { FileItem } from "../models/File";
import {
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useFilesViewModel = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [groupedFiles, setGroupedFiles] = useState<Record<string, FileItem[]>>({});
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [fileToDelete, setFileToDelete] = useState<{ folderPath: string; fileName: string } | null>(null);
  const [folderPages, setFolderPages] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "hcc_ai_users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchFilesFromFolder = async (folder: string): Promise<FileItem[]> => {
    const folderRef = ref(storage, folder);
    try {
      const res = await listAll(folderRef);
      const files = await Promise.all(res.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { name: item.name, url };
      }));
      return files;
    } catch (error) {
      console.error("Error listando archivos:", folder, error);
      return [];
    }
  };

  const fetchAllFiles = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      const fileGroups: Record<string, FileItem[]> = {};
      const subfolders = ["ecografias", "masks"];
      for (const sub of subfolders) {
        const fullPath = `${userData.imageFolder}${sub}/`;
        fileGroups[sub] = await fetchFilesFromFolder(fullPath);
      }

      if (userData.documentFolder) {
        fileGroups["informes"] = await fetchFilesFromFolder(userData.documentFolder);
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
        [folderName]: Math.max(direction === "next" ? currentPage + 1 : currentPage - 1, 1),
      };
    });
  };

  const handleUpload = async (folderPath: string, file: File) => {
    if (!file || !user) return;

    const storageRef = ref(storage, `${folderPath}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload error:", error);
        toast.error("Error al subir archivo");
      },
      async () => {
        await fetchAllFiles();
        toast.success(`Archivo "${file.name}" subido con éxito`);
      }
    );
  };

  const handleImageClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/editar-imagen?imageUrl=${encodeURIComponent(url)}`);
  };

  const confirmarEliminarArchivo = async () => {
    if (!fileToDelete) return;
    const { folderPath, fileName } = fileToDelete;
    const fileRef = ref(storage, `${folderPath}${fileName}`);

    try {
      await deleteObject(fileRef);
      await fetchAllFiles();
      toast.success(`Archivo "${fileName}" eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      toast.error("No se pudo eliminar el archivo");
    } finally {
      setFileToDelete(null);
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
    setFileToDelete,
    toggleFolder,
    changePage,
    handleUpload,
    confirmarEliminarArchivo,
    handleImageClick,
    fetchAllFiles,
  };
};
