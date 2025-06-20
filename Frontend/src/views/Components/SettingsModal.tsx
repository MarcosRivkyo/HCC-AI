import { useSettingsViewModel } from "../../viewmodels/useSettingsViewModel.ts";

import React from "react";
import Modal from "./Modal.tsx";
import ChangePasswordForm from "./ChangePasswordForm.tsx";
import DeleteAccountButton from "./DeleteAccountButton.tsx";
import { FaFilePdf } from "react-icons/fa";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";
import logoUSALsinBG from "../../assets/images/logo_usal_removebg.png";
import logoHPsinBG from "../../assets/images/logoHP-removebg.png";


interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  language: string;
  setLanguage: (lang: string) => void;
  scale: number;
  setScale: (scale: number) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  userData?: any; 
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,

  language,
  setLanguage,
  scale,
  setScale,
  highContrast,
  setHighContrast,
  userData,
}) => {

  const {
    uid,
    activeSection,
    setActiveSection,
    expandedItem,
    setExpandedItem,
    theme,
    setTheme,
    previewImage,
    setPreviewImage,
    newProfileImage,
    setNewProfileImage,
    userName,
    setUserName,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    isSaving,
    updateUserData,
    systemActive,
    toggleSystemStatus,
    userList,
    filteredUserList,
    busquedaNombre,
    setBusquedaNombre,
    filtroRol,
    setFiltroRol,
    fetchFirestoreUsers,
    handleRoleChange,
    handleToggle,
    deleteUserFromFirestore,
    dailyReminderEnabled,
    handleDailyReminderToggle,
  } = useSettingsViewModel(userData);
  


  const { t, i18n } = useTranslation("global");





  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    i18next.changeLanguage(newLang);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    localStorage.setItem("uiScale", newScale.toString());
  };




  if (!open) return null;

  return (
    <Modal open={open} onClose={() => onClose()} size="large">
      {}

      <div className="flex h-full">
        {}
        <div className="w-1/4 p-4 rounded-lg shadow-md h-full bg-gray-300 dark:bg-gray-800 flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <div className="flex justify-center mb-12">
              <FaCog className="text-6xl text-gray-600 dark:text-blue-400" />
            </div>

            <h2 className="text-3xl font-semibold mb-6 text-black dark:text-white text-center underline">
              {t("settings.title")}
            </h2>

            <ul className="space-y-6 text-black dark:text-white w-full text-center">
              {[
                { id: "Cuenta", label: t("settings.sections.account") },
                {
                  id: "Preferencias",
                  label: t("settings.sections.preferences"),
                },
                { id: "Ayuda", label: t("settings.sections.help") },

                ...(userData?.rol === "Administrador"
                  ? [{ id: "Administrador", label: "Administrador" }]
                  : []),
              ].map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`cursor-pointer text-2xl transition 
                    ${
                      activeSection === item.id
                        ? "text-red-600 font-semibold"
                        : "hover:text-red-300 text-black dark:text-white"
                    }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 text-center text-sm text-gray-700 dark:text-gray-400 border-t border-gray-400 dark:border-gray-700">
            {/* Logos centrados */}
            <div className="flex flex-col justify-center items-center space-y-2 mb-2">
              <a
                href="https://www.usal.es"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={logoUSALsinBG}
                  alt="Logo USAL"
                  className="w-32 h-auto cursor-pointer"
                />
              </a>
              <a
                href="https://www.hpscds.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={logoHPsinBG}
                  alt="Logo HP"
                  className="w-32 h-auto cursor-pointer"
                />
              </a>
            </div>

            <p className="font-medium ">Marcos Rivas Kyoguro</p>
            <a
              href="mailto:marcos.rivkyo@usal.es"
              className="text-xs break-words hover:underline"
            >
              marcos.rivkyo@usal.es
            </a>
            <p className="italic mt-1">© {new Date().getFullYear()} HCC-AI</p>
          </div>
        </div>

        {}
        <div className="border-l-2 border-gray-600 mx-4 h-20"></div>

        {}
        <div className="w-3/4 bg-white dark:bg-gray-800 p-6 h-full overflow-y-auto rounded-lg shadow-lg">
          {activeSection === "Cuenta" && (
            <div className="space-y-8">
              <h3 className="text-3xl text-black dark:text-white font-semibold mb-6">
                {t("settings.sections.account")}
              </h3>
              <ul className="space-y-6">
                {/* Perfil */}
                <li className="rounded-md border-b border-gray-400 dark:border-gray-600 transition">
                  <h4 className="p-4 text-lg font-semibold text-black dark:text-white">
                    {t("settings.account.profile")}
                  </h4>
                  <div className="pl-6 flex items-center space-x-8 pb-4">
                    <div className="flex-1 text-sm text-black dark:text-gray-100 space-y-2">
                      <p>
                        <strong>{t("settings.profile.first_name")}:</strong>{" "}
                        {firstName || "Desconocido"}
                      </p>
                      <p>
                        <strong>{t("settings.profile.last_name")}:</strong>{" "}
                        {lastName || "Desconocido"}
                      </p>
                      <p>
                        <strong>{t("settings.profile.email")}:</strong>{" "}
                        {userData?.email || "Desconocido"}
                      </p>
                      <p>
                        <strong>{t("settings.profile.phone")}:</strong>{" "}
                        {phone || "Desconocido"}
                      </p>
                    </div>
                    <div className="w-28 h-28 flex-shrink-0">
                      {userData?.profilePicture ? (
                        <img
                          src={userData.profilePicture}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover rounded-full border-2 border-gray-600 shadow-md"
                        />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center bg-gray-500 text-white rounded-full">
                          No foto
                        </div>
                      )}
                    </div>
                  </div>
                </li>

                {/* Modificar datos */}
                <li className="cursor-pointer rounded-md border-b border-gray-400 dark:border-gray-600 transition">
                  <button
                    className="w-full text-left p-4 text-lg font-medium text-black dark:text-white hover:text-blue-500"
                    onClick={() => handleToggle("modificarDatos")}
                  >
                    {t("settings.account.edit_data")}
                  </button>
                  {expandedItem === "modificarDatos" && (
                    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                      {/* Campos de formulario */}
                      {[
                        {
                          label: t("settings.profile.username"),
                          value:
                            userName !== ""
                              ? userName
                              : userData?.userName || "",
                          onChange: setUserName,
                        },
                        {
                          label: t("settings.profile.first_name"),
                          value:
                            firstName !== ""
                              ? firstName
                              : userData?.firstName || "",
                          onChange: setFirstName,
                        },
                        {
                          label: t("settings.profile.last_name"),
                          value:
                            lastName !== ""
                              ? lastName
                              : userData?.lastName || "",
                          onChange: setLastName,
                        },
                        {
                          label: t("settings.profile.phone"),
                          value: phone !== "" ? phone : userData?.phone || "",
                          onChange: setPhone,
                        },
                      ].map(({ label, value, onChange }, i) => (
                        <div key={i} className="mb-4">
                          <label className="block text-black dark:text-white mb-2">
                            {label}:
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                          />
                        </div>
                      ))}

                      {/* Imagen */}
                      <div className="mb-4">
                        <label className="block text-black dark:text-white mb-2">
                          {t("settings.profile.upload_image")}:
                        </label>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewProfileImage(file);
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  setPreviewImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {previewImage && (
                          <img
                            src={previewImage}
                            className="w-24 h-24 mt-4 object-cover rounded-full border border-gray-400 dark:border-gray-600"
                            alt="Previsualización"
                          />
                        )}
                      </div>

                      <button
                        onClick={updateUserData}
                        disabled={isSaving}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isSaving && (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        )}
                        {isSaving
                          ? t("settings.common.saving")
                          : t("settings.common.save_changes")}
                      </button>
                    </div>
                  )}
                </li>

                {/* Cambiar contraseña */}
                <li className="cursor-pointer rounded-md border-b border-gray-400 dark:border-gray-600 transition">
                  <button
                    className="w-full text-left p-4 text-lg font-medium 
                            text-black dark:text-white 
                            hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleToggle("modificarContraseña")}
                  >
                    {t("settings.account.change_password")}
                  </button>

                  {expandedItem === "modificarContraseña" && (
                    <div className="pl-6 pt-4">
                      <ChangePasswordForm />
                    </div>
                  )}
                </li>

                {/* Eliminar cuenta */}
                <li className="cursor-pointer rounded-md border-b border-gray-400 dark:border-gray-600 transition">
                  <button
                    className="w-full text-left p-4 text-lg font-medium text-red-600 hover:text-red-400"
                    onClick={() => handleToggle("eliminarCuenta")}
                  >
                    {t("settings.account.delete_account")}
                  </button>
                  {expandedItem === "eliminarCuenta" && (
                    <div className="pl-6 pt-4 text-red-400">
                      <p className="mb-4">
                        {t("settings.account.delete_warning")}
                      </p>
                      <DeleteAccountButton />
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}

          {activeSection === "Preferencias" && (
            <div className="space-y-8 w-full bg-gray dark:bg-gray-800 px-8 py-6 rounded-lg shadow-inner">
              <h3 className="text-3xl text-black dark:text-white font-semibold mb-6 border-b border-gray-600 pb-2">
                {t("settings.sections.preferences")}
              </h3>

              {/* Tema */}
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  {t("settings.preferences.theme")}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-black dark:text-white">
                    {t("settings.preferences.current_theme")}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme === "dark"}
                      onChange={() => {
                        const newTheme = theme === "light" ? "dark" : "light";
                        setTheme(newTheme);
                        localStorage.setItem("theme", newTheme);

                        if (newTheme === "dark") {
                          document.documentElement.classList.add("dark");
                        } else {
                          document.documentElement.classList.remove("dark");
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div
                      className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 
                                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                                    rounded-full peer dark:bg-gray-700 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-white after:border-gray-300 after:border 
                                    after:rounded-full after:h-5 after:w-5 after:transition-all 
                                    dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                  <span className="text-black dark:text-white">
                    {theme === "dark"
                      ? t("settings.preferences.dark")
                      : t("settings.preferences.light")}
                  </span>
                </div>
              </div>

              {/* Idioma */}
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  {t("settings.preferences.language")}
                </h4>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="language"
                    className="text-black dark:text-white"
                  >
                    {t("settings.preferences.select_language")}
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>

              {/* Escala */}
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  {t("settings.preferences.ui_scale")}
                </h4>
                <div className="flex flex-col space-y-2 text-black dark:text-white">
                  <label htmlFor="scale">
                    {t("settings.preferences.current_zoom")}
                  </label>
                  <input
                    type="range"
                    id="scale"
                    min="1"
                    max="1.3"
                    step="0.01"
                    value={scale}
                    onChange={handleScaleChange}
                    className="w-full accent-blue-500"
                  />
                  <span className="text-sm">
                    Zoom: {(scale * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {dailyReminderEnabled
                      ? "Desactivar envío diario de recordatorios por correo"
                      : "Activar envío diario de recordatorios por correo"}
                  </span>
                  <button
                    onClick={() => handleDailyReminderToggle(uid)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${
                      dailyReminderEnabled
                        ? "bg-green-500"
                        : "bg-gray-400 dark:bg-gray-600"
                    }`}
                    role="switch"
                    aria-checked={dailyReminderEnabled}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                        dailyReminderEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Accesibilidad */}
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  {t("settings.preferences.accessibility")}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-black dark:text-white">
                    {t("settings.preferences.high_contrast")}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={() => {
                        const newValue = !highContrast;
                        setHighContrast(newValue);
                        localStorage.setItem(
                          "highContrast",
                          newValue.toString(),
                        );
                        document.body.classList.toggle(
                          "high-contrast",
                          newValue,
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div
                      className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 
                                      peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-500 
                                      rounded-full peer dark:bg-gray-700 
                                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                      after:bg-white after:border-gray-300 after:border 
                                      after:rounded-full after:h-5 after:w-5 after:transition-all 
                                      dark:border-gray-600 peer-checked:bg-yellow-400"
                    ></div>
                  </label>
                  <span className="text-black dark:text-white">
                    {highContrast
                      ? t("settings.preferences.active")
                      : t("settings.preferences.desactive")}
                  </span>
                </div>
              </div>

              {/* Reset */}
              <div className="text-center">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                >
                  {t("settings.preferences.reset")}
                </button>
              </div>
            </div>
          )}

          {activeSection === "Ayuda" && (
            <div className="space-y-8 w-full px-8 py-6 rounded-lg shadow-inner">
              <h3 className="text-3xl text-black dark:text-white font-semibold mb-6 border-b border-gray-600 pb-2">
                {t("settings.title")}
              </h3>

              <div className="bg-gray-100 dark:bg-gray-900 p-4 mt-6 rounded-lg border border-gray-700">
                <p className="text-black dark:text-white font-semibold">
                  {t("settings.help.system_status")}
                </p>
                {systemActive === null ? (
                  <p className="text-gray-500 text-sm mt-1 italic">
                    {t("loading")}
                  </p>
                ) : systemActive ? (
                  <p className="text-green-700 font-semibold text-sm mt-1">
                    {t("settings.help.all_ok")}
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold text-sm mt-1">
                    {t("settings.help.all_ko")}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  window.open(
                    "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20VI.%20Manual%20de%20Usuario.pdf?alt=media&token=f38dbfef-710a-4d5d-8603-6bd35cb4694c",
                    "_blank",
                  )
                }
                className="flex items-center gap-2 px-6 py-3 bg-gray-400 dark:bg-gray-700 hover:bg-gray-700 text-black dark:text-white rounded-lg font-semibold transition"
              >
                <FaFilePdf className="text-red-700 text-xl" />
                {t("settings.help.download_manual")}
              </button>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-black dark:text-white ">
                  {t("settings.help.faq")}
                </h4>

                {[
                  {
                    pregunta: t("settings.help.question1"),
                    respuesta: t("settings.help.answer1"),
                  },
                  {
                    pregunta: t("settings.help.question2"),
                    respuesta: t("settings.help.answer2"),
                  },
                  {
                    pregunta: t("settings.help.question3"),
                    respuesta: t("settings.help.answer3"),
                  },
                  {
                    pregunta: t("settings.help.question4"),
                    respuesta: t("settings.help.answer4"),
                  },
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="group bg-gray-300 dark:bg-gray-900 p-4 rounded-lg border border-gray-700 cursor-pointer transition-all"
                  >
                    <p className="text-black dark:text-white font-semibold">
                      {faq.pregunta}
                    </p>
                    <p className="text-black dark:text-white text-sm mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                      {faq.respuesta}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-black dark:text-white mb-2">
                  {t("settings.help.support")}
                </p>
                <a
                  href="mailto:soporte@hcc-ai.com"
                  className="text-blue-600 underline hover:text-blue-600"
                >
                  marcos.rivkyo@usal.es
                </a>
              </div>
            </div>
          )}

          {activeSection === "Administrador" &&
            userData?.rol === "Administrador" && (
              <div className="space-y-8 w-full px-8 py-6 rounded-lg shadow-inner">
                <h3 className="text-3xl text-black dark:text-white font-semibold mb-6 border-b border-gray-600 pb-2">
                  {t("settings.admin.title")}
                </h3>

                {/* Sistema: Estado Global */}
                <section className="space-y-3">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {t("settings.admin.system_status")}
                  </h4>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-lg font-medium ${systemActive ? "text-green-600" : "text-red-500"}`}
                    >
                      {systemActive
                        ? `🟢 ${t("settings.admin.system_active")}`
                        : `🔴 ${t("settings.admin.system_inactive")}`}
                    </span>
                    <button
                      onClick={toggleSystemStatus}
                      className={`w-14 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                        systemActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                          systemActive ? "translate-x-7" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </section>

                {/* Usuarios */}
                <section className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {t("settings.admin.user_management")}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button
                        onClick={fetchFirestoreUsers}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition"
                      >
                        {t("settings.admin.list_users")}
                      </button>

                      <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={busquedaNombre}
                        onChange={(e) => setBusquedaNombre(e.target.value)}
                        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white w-full sm:w-72"
                      />

                      <select
                        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white w-full sm:w-44"
                        value={filtroRol}
                        onChange={(e) => setFiltroRol(e.target.value)}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Médico">Doctor</option>
                        <option value="Paciente">Paciente</option>
                      </select>
                    </div>
                  </div>

                  {filteredUserList.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-4">
                      {t("settings.admin.no_users_found")}
                    </p>
                  ) : (
                    <div className="w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-4">
                      <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold">
                          <tr>
                            <th className="px-4 py-3 text-left">
                              {t("settings.admin.name")}
                            </th>
                            <th className="px-4 py-3 text-left">
                              {t("settings.admin.enail")}
                            </th>
                            <th className="px-4 py-3 text-left">
                              {t("settings.admin.rol")}
                            </th>
                            <th className="px-4 py-3 text-left">UID</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredUserList.map((user, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                              <td
                                className="px-4 py-2 text-gray-800 dark:text-gray-300 max-w-[160px] truncate"
                                title={`${user.firstName} ${user.lastName}`}
                              >
                                {user.firstName} {user.lastName}
                              </td>
                              <td
                                className="px-4 py-2 text-gray-800 dark:text-gray-300 max-w-[220px] truncate"
                                title={user.email}
                              >
                                {user.email || "Sin email"}
                              </td>
                              <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                                <select
                                  value={user.rol || "Paciente"}
                                  onChange={(e) =>
                                    handleRoleChange(user.id, e.target.value)
                                  }
                                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                                >
                                  <option value="Paciente">Paciente</option>
                                  <option value="Médico">Médico</option>
                                  <option value="Administrador">
                                    Administrador
                                  </option>
                                </select>
                              </td>
                              <td
                                className="px-4 py-2 text-gray-900 dark:text-white max-w-[180px] truncate"
                                title={user.id}
                              >
                                {user.id}
                              </td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() =>
                                    deleteUserFromFirestore(user.id)
                                  }
                                  className="text-red-600 hover:text-red-400 text-sm font-semibold"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
