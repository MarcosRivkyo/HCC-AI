import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiImage,
  FiUpload,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarSecond from "../UI/InsideNavbar.tsx";
import ProfileModal from "../UI/ProfileModal.tsx";
import SettingsModal from "../UI/SettingsModal.tsx";
import Assistant from "./Assistant.tsx";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import logoHCC from "../../assets/images/logo_hcc_ai_bg.jpg";
import { useNavigate } from "react-router-dom";

interface FileItem {
  name: string;
  url: string;
}

const FilesPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [groupedFiles, setGroupedFiles] = useState<Record<string, FileItem[]>>(
    {},
  );
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [fileToDelete, setFileToDelete] = useState<{
    folderPath: string;
    fileName: string;
  } | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [folderPages, setFolderPages] = useState<Record<string, number>>({});

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
  const { t, i18n } = useTranslation("global");
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "hcc_ai_users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/editar-imagen?imageUrl=${encodeURIComponent(url)}`);
  };

  const fetchFilesFromFolder = async (folder: string): Promise<FileItem[]> => {
    const folderRef = ref(storage, folder);
    try {
      const res = await listAll(folderRef);
      const files = await Promise.all(
        res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        }),
      );
      return files;
    } catch (error) {
      console.error("Error listando archivos en", folder, error);
      return [];
    }
  };

  const fetchAllFiles = async () => {
    if (!userData) return;
    setLoading(true);

    try {
      const fileGroups: Record<string, FileItem[]> = {};
      const baseImageFolder = userData.imageFolder;
      const documentFolder = userData.documentFolder;

      const subfolders = ["ecografias", "masks"];
      for (const sub of subfolders) {
        const fullPath = `${baseImageFolder}${sub}/`;
        const files = await fetchFilesFromFolder(fullPath);
        fileGroups[sub] = files;
      }

      if (documentFolder) {
        const docs = await fetchFilesFromFolder(documentFolder);
        fileGroups["informes"] = docs;
      }

      setGroupedFiles(fileGroups);
    } finally {
      setLoading(false); // ← Termina loading
    }
  };

  const changePage = (folderName: string, direction: "next" | "prev") => {
    setFolderPages((prev) => {
      const currentPage = prev[folderName] || 1;
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      return {
        ...prev,
        [folderName]: Math.max(newPage, 1),
      };
    });
  };

  useEffect(() => {
    fetchAllFiles();
  }, [userData]);

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
    setFolderPages((prev) => ({ ...prev, [folderName]: 1 }));
  };

  const handleUpload = (
    folderPath: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
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
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setGroupedFiles((prev) => ({
          ...prev,
          [folderPath]: [...(prev[folderPath] || []), { name: file.name, url }],
        }));
        await fetchAllFiles();
        toast.success(`Archivo \"${file.name}\" subido con éxito`);
      },
    );
  };

  const confirmarEliminarArchivo = async () => {
    if (!fileToDelete) return;

    const { folderPath, fileName } = fileToDelete;
    const fileRef = ref(storage, `${folderPath}${fileName}`);
    try {
      await deleteObject(fileRef);
      await fetchAllFiles(); // ✅ Recarga segura desde Firebase
      toast.success(`Archivo "${fileName}" eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      toast.error("No se pudo eliminar el archivo");
    } finally {
      setFileToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
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
      <div className="flex-grow">
        {loading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Spinner circular */}
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

              {/* Logo estático o animado */}
              <img
                src={logoHCC}
                alt="Cargando..."
                className="w-20 h-12 object-contain"
              />
            </div>
          </div>
        ) : (
          <main className="w-full max-w-7xl mx-auto px-6 pt-20 flex-grow">
            <h2 className="text-4xl mt-8 font-bold text-center text-gray-800 dark:text-white mb-16 flex items-center justify-center gap-2">
              {" "}
              Archivos
            </h2>
            <div className="space-y-6">
              {Object.entries(groupedFiles).map(([folderName, files]) => {
                const isOpen = openFolders[folderName];
                const currentPage = folderPages[folderName] || 1;
                const filesPerPage = 6;
                const startIndex = (currentPage - 1) * filesPerPage;
                const endIndex = startIndex + filesPerPage;
                const paginatedFiles = files.slice(startIndex, endIndex);

                return (
                  <div
                    key={folderName}
                    className="bg-white dark:bg-gray-800 border rounded-xl shadow-md"
                  >
                    <div className="flex items-center justify-between px-5 py-4 text-lg font-semibold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-t-xl">
                      <div className="flex items-center gap-3 capitalize">
                        {folderName === "informes" ? (
                          <FiFileText size={20} />
                        ) : (
                          <FiImage size={20} />
                        )}
                        {folderName}
                      </div>
                      <div className="flex items-center gap-3">
                        <label
                          title="Subir archivo"
                          className="cursor-pointer flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <FiUpload />
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              const path =
                                folderName === "informes"
                                  ? userData?.documentFolder
                                  : `${userData?.imageFolder}${folderName}/`;
                              handleUpload(path, e);
                            }}
                          />
                        </label>
                        <button onClick={() => toggleFolder(folderName)}>
                          {isOpen ? (
                            <FiChevronDown size={20} />
                          ) : (
                            <FiChevronRight size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <>
                        <div className="px-5 pb-6 pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                          {paginatedFiles.map((file, idx) => {
                            const folderPath =
                              folderName === "informes"
                                ? userData?.documentFolder
                                : `${userData?.imageFolder}${folderName}/`;

                            return (
                              <div
                                key={idx}
                                className="relative bg-gray-100 dark:bg-gray-700 hover:shadow-xl p-4 rounded-lg"
                              >
                                <button
                                  onClick={() =>
                                    setFileToDelete({
                                      folderPath,
                                      fileName: file.name,
                                    })
                                  }
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                  title="Eliminar"
                                >
                                  <FiTrash2 size={18} />
                                </button>

                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate mb-2">
                                  {file.name}
                                </p>

                                {folderName === "informes" ? (
                                  <iframe
                                    src={`${file.url}#zoom=30`}
                                    title={file.name}
                                    className="w-full h-80 rounded border"
                                  />
                                ) : file.url.endsWith(".pdf") ? (
                                  <iframe
                                    src={`${file.url}#zoom=50`}
                                    title={file.name}
                                    className="w-full h-48 rounded border"
                                  />
                                ) : (
                                  <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-48 object-cover rounded shadow-sm"
                                  />
                                )}

                                <div className="mt-3 flex justify-between items-center">
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                                  >
                                    <FiEye /> Ver
                                  </a>

                                  {folderName !== "informes" &&
                                    !file.name
                                      .toLowerCase()
                                      .endsWith(".pdf") && (
                                      <button
                                        onClick={(e) =>
                                          handleImageClick(file.url, e)
                                        }
                                        className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1 hover:underline"
                                        title="Editar imagen"
                                      >
                                        ✏️ Editar
                                      </button>
                                    )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {files.length > filesPerPage && (
                          <div className="flex justify-between items-center mt-4 px-5">
                            <button
                              onClick={() => changePage(folderName, "prev")}
                              disabled={currentPage === 1}
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded disabled:opacity-50"
                            >
                              Anterior
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                              Página {currentPage} de{" "}
                              {Math.ceil(files.length / filesPerPage)}
                            </span>
                            <button
                              onClick={() => changePage(folderName, "next")}
                              disabled={endIndex >= files.length}
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded disabled:opacity-50"
                            >
                              Siguiente
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </main>
        )}
      </div>

      {fileToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Confirmar eliminación
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong>{fileToDelete.fileName}</strong>? Esta acción no se puede
              deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={confirmarEliminarArchivo}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
              >
                Eliminar
              </button>
              <button
                onClick={() => setFileToDelete(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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

      <footer className="w-full bg-gray-900 dark:bg-black text-white text-center py-4 shadow-lg rounded-t-lg">
        © 2025 HCC-AI
      </footer>
    </div>
  );
};

export default FilesPage;
