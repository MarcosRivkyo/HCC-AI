// src/views/Pages/MyStudies.tsx

import { useMisEstudios } from "../../viewmodels/useMyStudieViewModel.ts";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaDownload, FaTrashAlt } from "react-icons/fa";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

import NavbarSecond from "../Components/InsideNavbar.tsx";
import ProfileModal from "../Components/ProfileModal.tsx";
import Assistant from "./AssistantView";
import SettingsModal from "../Components/SettingsModal.tsx";
import usePreventZoom from "../Components/usePreventZoom.tsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import Footer from "../Components/InsideFooter.tsx";

const MisEstudios: React.FC = () => {
  const {
    user,
    userData,
    estudios,
    estudiosFiltrados,
    vista,
    setVista,
    estadoFiltro,
    setEstadoFiltro,
    ordenFecha,
    setOrdenFecha,
    busqueda,
    setBusqueda,
    fechaFiltro,
    setFechaFiltro,
    crearEstudio,
    eliminarEstudioVM,
    refetchEstudios,
    paginaActual,
    setPaginaActual,
    confirmarEliminacion,
    setConfirmarEliminacion,
    mostrarFormulario,
    setMostrarFormulario,
    formData,
    setFormData,
    isProfileOpen,
    setIsProfileOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    showAssistant,
    setShowAssistant,
    theme,
    setTheme,
    language,
    setLanguage,
    scale,
    setScale,
    highContrast,
    setHighContrast,
    pacientes,
    setPacientes,
  } = useMisEstudios();

  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();

  usePreventZoom(true, true);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
  }, [scale]);

  useEffect(() => {
    const fetchPacientes = async () => {
      const q = query(
        collection(db, "hcc_ai_users"),
        where("rol", "==", "Paciente"),
      );
      const querySnapshot = await getDocs(q);
      const listaPacientes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: `${doc.data().firstName} ${doc.data().lastName}`,
      }));
      setPacientes(listaPacientes);
    };

    fetchPacientes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.patientId || !formData.patientName) {
      toast.warning("Selecciona un paciente válido.");
      return;
    }

    try {
      const nuevoEstudioId = await crearEstudio(formData);
      setMostrarFormulario(false);
      setFormData({
        studieName: "",
        status: "En Progreso",
        studieDate: "",
        patientName: "",
        doctorName: "",
        doctorId: "",
        patientId: "",
        clinicalDescription: "",
      });

      toast.success("Estudio creado con éxito");
      navigate(`/estudio/${nuevoEstudioId}`);
    } catch (err: any) {
      toast.warning(err.message);
    }
  };

  const descargarPDF = (pdfReportUrl?: string) => {
    if (!pdfReportUrl) {
      toast.error(t("my_studies.no_pdf"));
      return;
    }
    window.open(pdfReportUrl, "_blank");
  };

  const eliminarEstudio = async (id: string) => {
    try {
      await eliminarEstudioVM(id);
      setConfirmarEliminacion(null);
      await refetchEstudios();
      toast.success(t("my_studies.delete_success"));
    } catch (error: any) {
      toast.error(
        t("my_studies.delete_error") || "Error al eliminar el estudio",
      );
    }
  };

  const estudiosPorPagina = 6;
  const indiceInicio = (paginaActual - 1) * estudiosPorPagina;
  const estudiosPaginados = estudiosFiltrados.slice(
    indiceInicio,
    indiceInicio + estudiosPorPagina,
  );

  const verEstudioDetalle = (id: string) => navigate(`/estudio/${id}`);

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setFormData({
      studieName: "",
      status: "En Progreso",
      studieDate: "",
      patientName: "",
      doctorName: "",
      doctorId: "",
      patientId: "",
      clinicalDescription: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
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

      <main className="flex-grow container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-8 mb-8 text-center">
          {t("my_studies.title")}
        </h1>

        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow p-4 mt-6 mb-8 flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white dark:text-white px-4 py-2 rounded-lg shadow w-full md:w-auto transition duration-200"
          >
            {t("my_studies.create_study")}
          </button>

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={t("my_studies.search_by_name")}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 w-full md:w-1/4"
          />
          <select
            value={vista}
            onChange={(e) =>
              setVista(e.target.value as "mios" | "compartidos" | "todos")
            }
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
          >
            <option value="todos">{t("my_studies.filter_all")}</option>
            <option value="mios">{t("my_studies.filter_mine")}</option>
            <option value="compartidos">{t("my_studies.filter_shared")}</option>
          </select>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
          >
            <option value="">{t("my_studies.filter_all")}</option>
            <option value="En Progreso">
              {t("my_studies.status_in_progress")}
            </option>
            <option value="Finalizado">{t("my_studies.status_done")}</option>
          </select>

          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 w-full md:w-1/4"
          />

          <select
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value as "asc" | "desc")}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
          >
            <option value="desc">{t("my_studies.sort_newest")}</option>
            <option value="asc">{t("my_studies.sort_oldest")}</option>
          </select>
        </div>

        {estudiosPaginados.length === 0 ? (
          <p className="text-center text-gray-500">
            {t("my_studies.no_studies")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {estudiosPaginados.map((estudio) => (
              <div
                key={estudio.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105"
              >
                {estudio.imagenUrl ? (
                  <div
                    className="h-48 w-full overflow-hidden cursor-pointer"
                    onClick={() => verEstudioDetalle(estudio.id)}
                    title="Ir al estudio"
                  >
                    <img
                      src={estudio.imagenUrl}
                      alt="Miniatura"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-400 dark:bg-gray-800" />
                )}

                <div className="p-5 bg-gray-000 dark:bg-gray-900">
                  <h2
                    onClick={() => verEstudioDetalle(estudio.id)}
                    className="text-lg font-bold text-blue-800 dark:text-blue-400 cursor-pointer hover:underline truncate"
                  >
                    {estudio.studieName}
                  </h2>
                  <p className="text-sm text-gray-900 dark:text-gray-400">
                    {estudio.studieDate?.toDate
                      ? estudio.studieDate
                          .toDate()
                          .toLocaleDateString(i18n.language)
                      : t("my_studies.no_date")}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                      estudio.status === "Finalizado"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {t(
                      estudio.status === "Finalizado"
                        ? "my_studies.status_done"
                        : "my_studies.status_in_progress",
                    )}
                  </span>

                  {user && estudio.doctorId !== user.uid && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 7a3 3 0 10-2.83-2H9a3 3 0 00-5.83.87A2 2 0 002 7a2 2 0 001 1.73V10a2 2 0 001.12 1.78A5.97 5.97 0 007 13a5.97 5.97 0 002.88-.72A2 2 0 0011 10V8.73A2 2 0 0012 7h1z" />
                      </svg>
                      Compartido
                    </span>
                  )}

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => descargarPDF(estudio.pdfReportUrl)}
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-700 text-blue-600 dark:text-blue-300 transition"
                      title="Descargar PDF"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => setConfirmarEliminacion(estudio.id)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-700 text-red-600 dark:text-red-300 transition"
                      title="Eliminar"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmación de eliminación */}
        {confirmarEliminacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-sm w-full">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {t("my_studies.delete_title")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                {t("my_studies.delete_warning")}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => eliminarEstudio(confirmarEliminacion)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                >
                  {t("actions.delete")}
                </button>
                <button
                  onClick={() => setConfirmarEliminacion(null)}
                  className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {t("actions.cancel")}
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {t("actions.previous")}
          </button>

          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {t("pagination.page")} {paginaActual} {t("pagination.of")}{" "}
            {Math.ceil(estudiosFiltrados.length / estudiosPorPagina) || 1}
          </span>

          <button
            onClick={() =>
              setPaginaActual((p) =>
                p * estudiosPorPagina < estudiosFiltrados.length ? p + 1 : p,
              )
            }
            disabled={
              paginaActual * estudiosPorPagina >= estudiosFiltrados.length
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {t("actions.next")}
          </button>
        </div>
      </main>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {t("my_studies.new_study")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="studieName"
                value={formData.studieName}
                onChange={handleChange}
                placeholder={t("my_studies.study_name")}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md"
                required
              />
              <input
                type="date"
                name="studieDate"
                value={formData.studieDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md"
                required
              />
              <select
                name="patientId"
                value={formData.patientId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedPaciente = pacientes.find(
                    (p) => p.id === selectedId,
                  );
                  setFormData((prev) => ({
                    ...prev,
                    patientId: selectedId,
                    patientName: selectedPaciente?.name || "",
                  }));
                }}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md"
                required
              >
                <option value="">{t("my_studies.select_patient")}</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="clinicalDescription"
                value={formData.clinicalDescription}
                onChange={handleChange}
                placeholder={t("my_studies.clinical_description")}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                >
                  {t("actions.cancel")}
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  {t("my_studies.create_study")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      <Footer />
    </div>
  );
};

export default MisEstudios;
