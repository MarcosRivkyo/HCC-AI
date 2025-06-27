// src/views/Pages/DetailedStudy.tsx

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BarChart from "../Components/BarChart.tsx";

import NavbarSecond from "../Components/InsideNavbar.tsx";

import ProfileModal from "../Components/ProfileModal.tsx";
import SettingsModal from "../Components/SettingsModal.tsx";
import usePreventZoom from "../Components/usePreventZoom.tsx";
import logoHCC from "../../assets/images/logo_hcc_ai_bg.jpg";

import Assistant from "./AssistantView.tsx";
import {
  FaChartBar,
  FaDownload,
  FaEnvelope,
  FaShareAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import EstudiosRecientesCompact from "../Components/RecentStudiesCompact.tsx";
import { useTranslation } from "react-i18next";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FaEdit } from "react-icons/fa";
import Footer from "../Components/AppFooter.tsx";

import { useEstudioDetalleViewModel } from "../../viewmodels/useDetailedStudyViewModel.ts";

const EstudioDetalle = () => {
  const { id } = useParams();

  const {
    estudio,
    selectedSubModel,
    setSelectedSubModel,
    loading,
    subiendoImagen,
    predict,
    user,
    userData,
    showExplanationModal,
    setShowExplanationModal,
    isSendingEmail,
    isProfileOpen,
    setIsProfileOpen,
    selectedSegmentationSubModel,
    setSelectedSegmentationSubModel,
    confidenceThreshold,
    setConfidenceThreshold,
    htmlExplicacion,
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
    segmentation,
    explicacionGenerada,
    usarExplicacionIA,
    setUsarExplicacionIA,
    showEmailModal,
    setShowEmailModal,
    emailToSend,
    setEmailToSend,
    showShareModal,
    setShowShareModal,
    doctorsList,
    selectedDoctorId,
    setSelectedDoctorId,
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
    descargarPDF,
    handleCancelEdit,
    enviarPDFporCorreo,
    handleSendEmail,
    handleInputChange,
    handleSaveChanges,
    handleImagenChange,
    handleEliminarEcografia,
    handleDrop,
    handleDownloadChart,
    toLocalDatetimeInputValue,
    handleShareStudy,
    iniciarPrediccionIA,
  } = useEstudioDetalleViewModel();

  const { t } = useTranslation("global");

  usePreventZoom(true, true);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
  }, [scale]);

  if (loading)
    return (
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
    );
  if (!estudio)
    return (
      <p className="text-center text-red-600">No se encontró el estudio.</p>
    );

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex flex-col text-gray-800 dark:text-gray-100">
      {!mostrarEstudiosRecientes && userData?.rol !== "Paciente" && (
        <button
          onClick={() => setMostrarEstudiosRecientes(true)}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 shadow"
          title="Mostrar estudios recientes"
        >
          <FiArrowRight />
        </button>
      )}

      {mostrarEstudiosRecientes && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40">
          <div className="h-full flex flex-col justify-center p-4">
            <EstudiosRecientesCompact />
          </div>
        </div>
      )}

      {mostrarEstudiosRecientes && (
        <button
          onClick={() => setMostrarEstudiosRecientes(false)}
          className="fixed top-1/2 left-80 transform -translate-y-1/2 z-50 bg-gray-600 text-white p-2 rounded-r-md hover:bg-gray-700 shadow"
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
        isPatientView={isPatient}
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

      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] px-4 py-10 mt-20">
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
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

          {/* FILA 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 dark:bg-gray-800">
            <div className="relative bg-yellow-100 dark:bg-yellow-200 rounded-xl p-6 space-y-4 shadow-lg border-l-8 border-yellow-400 transform rotate-[-0.5deg]">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md z-10" />

              <div className="flex items-center justify-between mb-2">
                <div>
                  {editing ? (
                    <input
                      type="text"
                      name="studieName"
                      value={editedEstudio?.studieName || ""}
                      onChange={handleInputChange}
                      className="text-2xl font-bold px-2 py-1 border rounded-md w-full dark:text-black"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 w-full">
                      {estudio?.studieName}
                    </h1>
                  )}

                  <p className="text-sm text-gray-600">
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

              <p className="text-gray-800">
                <strong>{t("dashboard.study_date")}:</strong>{" "}
                {editing ? (
                  <input
                    type="datetime-local"
                    name="studieDate"
                    value={
                      editedEstudio?.studieDate
                        ? toLocalDatetimeInputValue(
                            editedEstudio.studieDate?.seconds
                              ? new Date(
                                  editedEstudio.studieDate.seconds * 1000,
                                )
                              : new Date(editedEstudio.studieDate),
                          )
                        : ""
                    }
                    onChange={(e) =>
                      setEditedEstudio((prev) => ({
                        ...prev!,
                        studieDate: new Date(e.target.value),
                      }))
                    }
                    className="text-gray-800 text-lg border rounded px-2 py-1 dark:text-black"
                  />
                ) : (
                  <span className="text-gray-700 text-lg">
                    {new Date(
                      estudio?.studieDate?.seconds
                        ? estudio.studieDate.seconds * 1000 
                        : estudio?.studieDate, 
                    ).toLocaleString()}
                  </span>
                )}
              </p>

              <p className="text-gray-800">
                <strong>{t("my_studies.doctor_name")}:</strong>{" "}
                <span className="text-gray-700 text-lg">
                  {estudio?.doctorName ?? "Desconocido"}
                </span>
              </p>

              <p className="text-gray-800">
                <strong>{t("my_studies.patient_name")}:</strong>{" "}
                <span className="text-gray-700 text-lg">
                  {estudio?.patientName ?? "Desconocido"}
                </span>
              </p>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {t("my_studies.clinical_description")}
                </h2>
                {editing ? (
                  <textarea
                    name="clinicalDescription"
                    value={editedEstudio?.clinicalDescription || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:text-black"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {estudio?.clinicalDescription}
                  </p>
                )}
              </div>

              {editing && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleSaveChanges}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              )}
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
                    onChange={(e) => {
                      if (userData?.rol === "Paciente") {
                        toast.warn("No tienes permiso para subir imágenes.");
                        return;
                      }
                      if (!estudio?.predictionId) {
                        handleImagenChange(e);
                      }
                    }}
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
              {userData?.rol !== "Paciente" && (
                <div className="flex flex-col space-y-2 bg-gray-900 dark:bg-gray-900 p-2 rounded-lg shadow-md w-auto">
                  {/* Editar */}
                  <button
                    onClick={() => setEditing(!editing)}
                    title="Editar estudio"
                    className={`w-10 h-10 flex items-center justify-center rounded-md transition 
                    ${
                      editing
                        ? "bg-yellow-400 hover:bg-yellow-500"
                        : "bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FaEdit
                      className={
                        editing ? "text-black" : "text-gray-700 dark:text-white"
                      }
                    />
                  </button>

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
                    <FaEnvelope className="text-gray-700 dark:text-white" />
                  </button>

                  {/* Compartir */}
                  <button
                    onClick={() => setShowShareModal(true)}
                    title="Compartir estudio"
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <FaShareAlt className="text-gray-700 dark:text-white" />
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
              )}
            </div>
          </div>

          {/* FILA 2 */}
          <div className="w-full flex justify-center my-4">
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          {!estudio?.predictionId && userData?.rol !== "Paciente" && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (!estudio.imagenUrl) {
                    toast.warn("Debes subir una imagen antes de iniciar el análisis.");
                    return;
                  }
                  setParametersVisible(true);
                }}
                disabled={!estudio.imagenUrl}
                className={`px-6 py-2 rounded-md shadow-md transition ${
                  estudio.imagenUrl
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {t("my_studies.start_analysis")}
              </button>
            </div>
          )}

          {/* Mostrar los parámetros del análisis */}
          {parametersVisible && (
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-4xl text-center">
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
                          setSelectedSegmentationSubModel(""); 
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
                        {/* Umbral de Confianza */}
                        <div className="w-full flex flex-col items-center justify-center gap-6 mt-6">

                          {/* Umbral de Confianza */}
                          <div className="text-center w-full max-w-sm">
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
                                setConfidenceThreshold(parseFloat(e.target.value) / 100)
                              }
                              className="w-full dark:text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center"
                            />
                            <p className="text-xs text-gray-500 mt-1 dark:text-gray-300">
                              {t("my_studies.threshold_explanation")}
                            </p>
                          </div>

                          {/* Checkbox */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="usarExplicacionIA"
                              checked={usarExplicacionIA}
                              onChange={() => setUsarExplicacionIA(!usarExplicacionIA)}
                              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor="usarExplicacionIA"
                              className="text-sm font-medium text-gray-700 dark:text-white"
                            >
                              {t("my_studies.generate_ai_explanation")}
                            </label>
                          </div>
                        </div>


                      </div>
                  )}
                </div>

                {/* Botón para iniciar la predicción */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      if (!estudio.imagenUrl) {
                        toast.warn("Debes subir una imagen antes de iniciar la predicción.");
                        return;
                      }
                      iniciarPrediccionIA();
                    }}
                    className={`bg-yellow-400 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${
                      !selectedClassificationModel ||
                      !selectedSegmentationModel ||
                      !estudio.imagenUrl
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      !selectedClassificationModel ||
                      !selectedSegmentationModel ||
                      !estudio.imagenUrl
                    }
                  >
                    {t("my_studies.start_prediction")}
                  </button>

                </div>
              </div>
            </div>
          )}

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
                    title="Ver en forma de gráfica"
                    className="w-8 h-8 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center hover:bg-blue-700"
                  >
                    <FaChartBar className="w-4 h-4" />
                  </button>
                </div>

                {showExplanationModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-2xl relative space-y-6">
                      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                        Gráfico de Probabilidades
                      </h2>
                      <div ref={chartRef}>
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
                      <div className="flex justify-between pt-2 gap-2">
                        <button
                          onClick={handleDownloadChart}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium shadow"
                        >
                          Descargar gráfico
                        </button>
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

                <div className="inset-0 flex items-center justify-center">
                  <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-xl relative space-y-4">
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                      {t("my_studies.class_probabilities")}:
                    </h2>

                    {(selectedClassificationModel === "HCC-AI"
                      ? ["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"]
                      : ["F0", "F1", "F2", "F3", "F4"]
                    ).map((label, index) => {
                      const prob = prediction.probabilities[index] || 0;
                      const percentage = (prob * 100).toFixed(2);

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
                disabled={isSendingEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
              >
                {isSendingEmail ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                ) : (
                  "Enviar"
                )}
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
                onClick={handleShareStudy}
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {t("my_studies.delete_title")}
            </h2>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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

      <Footer />
    </div>
  );
};

export default EstudioDetalle;
