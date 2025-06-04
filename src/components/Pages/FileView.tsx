import React, { useState, useEffect } from "react";
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
import Assistant from "./AssistantView.tsx";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import logoHCC from "../../assets/images/logo_hcc_ai_bg.jpg";
import usePreventZoom from "../UI/usePreventZoom.tsx";
import { useFilesViewModel } from "../../viewmodels/FileViewModel.ts";
import Footer from "../UI/InsideFooter.tsx";

const FilesPage: React.FC = () => {
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
  const { t, i18n } = useTranslation("global");

  usePreventZoom(true, true);

  const {
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
    fetchAllFiles,
    handleImageClick,
  } = useFilesViewModel();

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
  }, [scale]);

  useEffect(() => {
    if (userData) {
      fetchAllFiles();
    }
  }, [userData]);

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
                              const file = e.target.files?.[0];
                              if (file && path) handleUpload(path, file);
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

    <Footer />
    
    </div>
  );
};

export default FilesPage;
