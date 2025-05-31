import React, { useState } from "react";
import Modal from "./Modal";
import settingsIcon from "../../assets/images/settings_icon.png";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountButton from "./DeleteAccountButton";
import { FaFilePdf } from "react-icons/fa";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FaCog } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "../../config/firebase.ts";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";

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
  userData?: any; // Optional prop if you want to pass user data
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

  const auth = getAuth();
  const uid = userData?.uid || auth.currentUser?.uid;
  const db = getFirestore(app);

  const [activeSection, setActiveSection] = useState("Cuenta");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light",
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [userName, setUserName] = useState(userData?.userName || "");
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const { t, i18n } = useTranslation("global");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setUserName(userData.userName || "");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhone(userData.phone || "");
    }
  }, [userData]);

  const handleToggle = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

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


const updateUserData = async () => {
  setIsSaving(true);
  try {
    const auth = getAuth();

    const uid = userData?.uid || auth.currentUser?.uid;

    if (!uid) {
      console.warn("UID de usuario no definido.");
      toast.error("No se pudo actualizar: UID de usuario no definido.");
      setIsSaving(false);
      return;
    }

    let photoURL = userData?.profilePicture || "";

    if (newProfileImage) {
      const storage = getStorage();
      const folderPath = userData?.imageFolder || `HCC-AI/users/${uid}/images`;
      const storageRef = ref(
        storage,
        `${folderPath}/profile_pictures/${newProfileImage.name}`
      );
      await uploadBytes(storageRef, newProfileImage);
      photoURL = await getDownloadURL(storageRef);
    }

    const docRef = doc(db, "hcc_ai_users", uid);
    console.log("Actualizando documento:", docRef.path);
    await updateDoc(docRef, {
      userName,
      firstName,
      lastName,
      phone,
      profilePicture: photoURL,
    });

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: userName, 
        photoURL: photoURL,
      });
    }

    console.log("Datos actualizados:", {
      userName,
      firstName,
      lastName,
      phone,
      profilePicture: photoURL,
    });

    toast.success("Datos actualizados correctamente.");
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    toast.error("Error al actualizar datos del perfil.");
  } finally {
    setIsSaving(false);
  }
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
            <p className="font-medium">Marcos Rivas Kyoguro</p>
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
                {t("settings.help.system_status")}
              </h3>

              <div className="bg-gray-100 dark:bg-gray-900 p-4 mt-6 rounded-lg border border-gray-700">
                <p className="text-black dark:text-white font-semibold">
                  Estado del Sistema:
                </p>
                <p className="text-green-700 font-semibold text-sm mt-1">
                  {t("settings.help.all_ok")}
                </p>
              </div>

              <button
                onClick={() =>
                  window.open(
                    "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448",
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
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
