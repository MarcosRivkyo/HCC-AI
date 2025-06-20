import { useFilesViewModel } from "../../viewmodels/useFileViewModel.ts";
import React, { useEffect } from "react";

import { toast } from "react-toastify";
import NavbarSecond from "../Components/InsideNavbar.tsx";
import ProfileModal from "../Components/ProfileModal.tsx";
import SettingsModal from "../Components/SettingsModal.tsx";
import Assistant from "./AssistantView.tsx";
import logoHCC from "../../assets/images/logo_hcc_ai_bg.jpg";
import usePreventZoom from "../Components/usePreventZoom.tsx";
import Footer from "../Components/InsideFooter.tsx";
import Modal from "../Components/Modal.tsx";

import {
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiImage,
  FiTrash2,
  FiEye,
  FiInfo,
} from "react-icons/fi";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

import "react-toastify/dist/ReactToastify.css";

const FilesPage: React.FC = () => {
  const { t } = useTranslation("global");

  usePreventZoom(true, true);

  const {
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
        isPatientView={false}
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
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

              <img
                src={logoHCC}
                alt="Cargando..."
                className="w-20 h-12 object-contain rounded-full"
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
                    <div
                      onClick={() => toggleFolder(folderName)}
                      className="flex items-center justify-between px-5 py-4 text-lg font-semibold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-t-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <div className="flex items-center gap-3 capitalize">
                        {folderName === "informes" ? (
                          <FiFileText size={20} />
                        ) : (
                          <FiImage size={20} />
                        )}
                        {folderName}
                      </div>
                      <div className="flex items-center gap-3">
                        {isOpen ? (
                          <FiChevronDown size={20} />
                        ) : (
                          <FiChevronRight size={20} />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <>
                        {paginatedFiles.length === 0 ? (
                          <div className="px-5 py-4 text-center text-gray-500 dark:text-gray-400 italic">
                            {folderName === "informes"
                              ? "No hay informes disponibles."
                              : "No hay imágenes disponibles."}
                          </div>
                        ) : (
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

                                    {folderName === "informes" ? (
                                      <button
                                        onClick={() =>
                                          handleOpenDocumentInfo(file.url)
                                        }
                                        className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 hover:underline"
                                        title="Ver información del informe"
                                      >
                                        <FiInfo /> Info
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleOpenImageInfo(file.url)
                                        }
                                        className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 hover:underline"
                                        title="Ver información de la imagen"
                                      >
                                        <FiInfo /> Info
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
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

            {imageInfoOpen && imageInfo && (
              <Modal
                open={imageInfoOpen}
                onClose={() => setImageInfoOpen(false)}
              >
                <div className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-700 p-6 rounded-xl text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    Información de Imagen
                  </h2>

                  <img
                    src={imageInfo.url}
                    alt="Vista previa"
                    className="w-full max-h-64 object-contain mb-4 rounded-lg shadow-md border border-white"
                  />

                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center">
                      <span>
                        <span className="font-semibold">Estudio ID:</span>{" "}
                        {imageInfo.estudioId}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(imageInfo.estudioId);
                          toast.success("ID copiado");
                        }}
                        className="ml-2 px-2 py-1 text-xs bg-white text-gray-800 rounded hover:bg-gray-100"
                      >
                        Copiar
                      </button>
                    </li>

                    <li>
                      <span className="font-semibold">Subido por:</span>{" "}
                      {imageInfo.subidoPorDoctorId}
                    </li>
                    <li>
                      <span className="font-semibold">Fecha de subida:</span>{" "}
                      {new Date(
                        imageInfo.fechaSubida.seconds * 1000,
                      ).toLocaleString()}
                    </li>

                    <li>
                      <span className="font-semibold">Resolución:</span>{" "}
                      {imageInfo.resolucion}
                    </li>
                    <li>
                      <span className="font-semibold">Peso:</span>{" "}
                      {imageInfo.pesoKB} KB
                    </li>
                    <li>
                      <span className="font-semibold">Tipo:</span>{" "}
                      {imageInfo.tipo}
                    </li>
                    <li>
                      <span className="font-semibold">ID de predicción:</span>{" "}
                      {imageInfo.idPrediccion || "Aún sin analizar"}
                    </li>

                    <li>
                      <span className="font-semibold">Clase predicha:</span>{" "}
                      {typeof imageInfo.clasePredicha === "number"
                        ? imageInfo.clasePredicha
                        : "Aún sin analizar"}
                    </li>
                  </ul>
                </div>
              </Modal>
            )}

            {documentInfoOpen && documentInfo && (
              <Modal
                open={documentInfoOpen}
                onClose={() => {
                  setDocumentInfoOpen(false);
                  setDocumentInfo(null);
                }}
              >
                <div className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-700 p-6 rounded-xl text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    Información del Informe
                  </h2>

                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="font-semibold">Estudio ID:</span>{" "}
                      {documentInfo.estudioId}
                    </li>
                    <li>
                      <span className="font-semibold">Fecha de creación:</span>{" "}
                      {new Date(
                        documentInfo.fechaCreacion.seconds * 1000,
                      ).toLocaleString()}
                    </li>

                    <li>
                      <span className="font-semibold">Médico autor:</span>{" "}
                      {documentInfo.doctorId}
                    </li>
                    <li>
                      <span className="font-semibold">Paciente:</span>{" "}
                      {documentInfo.pacienteId}
                    </li>
                  </ul>
                </div>
              </Modal>
            )}
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
