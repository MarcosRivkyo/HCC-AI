import React, { useState } from "react";
import Modal from "./Modal";
import settingsIcon from "../../assets/images/settings_icon.png";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountButton from "./DeleteAccountButton";
import { FaFilePdf } from "react-icons/fa";

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
  theme,
  setTheme,
  language,
  setLanguage,
  scale,
  setScale,
  highContrast,
  setHighContrast,
  userData,
}) => {
  const [activeSection, setActiveSection] = useState("Cuenta");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [userName, setUserName] = useState(userData?.userName || "");
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [phone, setPhone] = useState(userData?.phone || "");

  const handleToggle = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    localStorage.setItem("uiScale", newScale.toString());
  };

  const updateUserData = () => {
    console.log("Actualizar datos del usuario", {
      userName,
      firstName,
      lastName,
      phone,
      newProfileImage,
    });
    // Aquí iría la lógica para guardar cambios en base de datos o backend
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={() => onClose()} size="large">
      {}

      <div className="flex h-full">
        {}
        <div className="w-1/4  p-4 rounded-lg shadow-md h-25">
          <div className="flex justify-center mb-4">
            <img src={settingsIcon} alt="Logo HCC_AI" className="w-20 h-20" />
          </div>

          <h2 className="text-3xl font-semibold mb-6 text-white text-center underline ">
            Configuración
          </h2>

          <ul className="space-y-6 text-white">
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => setActiveSection("Cuenta")}
            >
              Cuenta
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => setActiveSection("Preferencias")}
            >
              Preferencias
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => setActiveSection("Ayuda")}
            >
              Ayuda
            </li>
          </ul>
        </div>

        {}
        <div className="border-l-2 border-gray-600 mx-4 h-20"></div>

        {}
        <div className="w-3/4 bg-gray-800 p-6 h-full overflow-y-auto rounded-lg shadow-lg">
          {activeSection === "Cuenta" && (
            <div className="space-y-8 bg-gray-800">
              <h3 className="text-3xl text-white font-semibold mb-6">Cuenta</h3>

              <ul className="space-y-6 text-white bg-gray-800">
                {}
                <li className="hover:bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium hover:text-blue-500 transition"
                    onClick={() => handleToggle("perfil")}
                  >
                    <span>Perfil</span>
                  </button>

                  {expandedItem === "perfil" || userData ? (
                    <div className="pl-6 flex items-center space-x-8">
                      {}
                      <div className="flex-1 text-sm space-y-2">
                        <p>
                          <strong>Nombre:</strong>{" "}
                          {userData?.firstName || "Desconocido"}
                        </p>
                        <p>
                          <strong>Apellidos:</strong>{" "}
                          {userData?.lastName || "Desconocido"}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {userData?.email || "Desconocido"}
                        </p>
                        <p>
                          <strong>Teléfono:</strong>{" "}
                          {userData?.phone || "Desconocido"}
                        </p>
                        <p>
                          <strong>Rol:</strong>{" "}
                          {userData?.jobTitle || "Desconocido"}
                        </p>
                      </div>

                      {}
                      <div className="w-28 h-28 flex-shrink-0">
                        {userData?.profilePicture ? (
                          <img
                            src={userData.profilePicture}
                            alt="Foto de perfil"
                            className="w-full h-full object-cover rounded-full border-2 border-gray-600 shadow-md"
                          />
                        ) : (
                          <div className="w-full h-full flex justify-center items-center bg-gray-600 rounded-full text-white text-sm">
                            No foto
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Cargando perfil...</p>
                  )}
                </li>

                {}
                <li className="hover:bg-gray-800 bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium hover:text-blue-500 transition"
                    onClick={() => handleToggle("modificarDatos")}
                  >
                    <span>Modificar Datos</span>
                  </button>

                  {expandedItem === "modificarDatos" && (
                    <div className="p-6 bg-gray-900 rounded-xl shadow-lg mt-8 border border-gray-700">
                      <div className="space-y-6">
                        {}
                        {[
                          "Nombre de usuario",
                          "Nombre",
                          "Apellido",
                          "Teléfono",
                        ].map((label, idx) => {
                          const value =
                            label === "Nombre de usuario"
                              ? userName || userData?.userName || ""
                              : label === "Nombre"
                                ? firstName || userData?.firstName || ""
                                : label === "Apellido"
                                  ? lastName || userData?.lastName || ""
                                  : phone || userData?.phone || "";

                          const onChange = (
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const val = e.target.value;
                            if (label === "Nombre de usuario") setUserName(val);
                            if (label === "Nombre") setFirstName(val);
                            if (label === "Apellido") setLastName(val);
                            if (label === "Teléfono") setPhone(val);
                          };

                          return (
                            <div key={idx}>
                              <label className="block text-gray-300 mb-2">
                                {label}:
                              </label>
                              <input
                                type="text"
                                className="w-full p-4 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={value}
                                onChange={onChange}
                              />
                            </div>
                          );
                        })}

                        {}
                        <div>
                          <label className="block text-gray-300 mb-2">
                            Nueva imagen de perfil:
                          </label>
                          <input
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setNewProfileImage(e.target.files[0]);
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === "string") {
                                    setPreviewImage(reader.result);
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                            className="text-white"
                          />

                          {previewImage && (
                            <div className="mt-4">
                              <p className="text-gray-400 text-sm mb-1">
                                Previsualización:
                              </p>
                              <img
                                src={previewImage}
                                alt="Previsualización"
                                className="w-32 h-32 object-cover rounded-full border-2 border-gray-600 transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          )}
                        </div>

                        <button
                          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-md transition duration-300"
                          onClick={updateUserData}
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  )}
                </li>

                {}
                <li className="hover:bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium hover:text-blue-500 transition"
                    onClick={() => handleToggle("modificarContraseña")}
                  >
                    <span>Modificar Contraseña</span>
                  </button>

                  {expandedItem === "modificarContraseña" && (
                    <div className="pl-6">
                      <ChangePasswordForm />
                    </div>
                  )}
                </li>

                {}
                <li className="hover:bg-gray-800 cursor-pointer rounded-md border-b border-gray-600 transition-all duration-300">
                  <button
                    className="w-full text-left p-4 text-lg font-medium text-red-500 hover:text-red-400 transition"
                    onClick={() => handleToggle("eliminarCuenta")}
                  >
                    <span>Eliminar Cuenta</span>
                  </button>

                  {expandedItem === "eliminarCuenta" && (
                    <div className="pl-6 pt-6 pb-6 text-red-400 bg-gray-800 rounded-md">
                      <p className="text-lg font-semibold mb-4">
                        ¡Esta acción eliminará tu cuenta permanentemente!
                      </p>
                      <DeleteAccountButton />
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}

          {activeSection === "Preferencias" && (
            <div className="space-y-8 w-full bg-gray-800 px-8 py-6 rounded-lg shadow-inner">
              <h3 className="text-3xl text-white font-semibold mb-6 border-b border-gray-600 pb-2">
                Preferencias
              </h3>

              {/* Tema */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-white-400">Tema</h4>
                <div className="flex items-center justify-between">
                  <span className="text-white">Tema actual:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme === "dark"}
                      onChange={() => {
                        const newTheme = theme === "light" ? "dark" : "light";
                        setTheme(newTheme);
                        localStorage.setItem("theme", newTheme);
                        // Sincroniza también el estilo general
                        document.body.classList.toggle(
                          "dark-theme",
                          newTheme === "dark",
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div
                      className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                                    rounded-full peer dark:bg-gray-700 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-white after:border-gray-300 after:border 
                                    after:rounded-full after:h-5 after:w-5 after:transition-all 
                                    dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                  <span className="text-white">
                    {theme === "dark" ? "Oscuro" : "Claro"}
                  </span>
                </div>
              </div>

              {/* Idioma */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-white-400">Idioma</h4>
                <div className="flex items-center justify-between">
                  <label htmlFor="language" className="text-white">
                    Selecciona el idioma:
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Escala */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-white-400">
                  Escala de Interfaz
                </h4>
                <div className="flex flex-col space-y-2 text-white">
                  <label htmlFor="scale">Zoom actual:</label>
                  <input
                    type="range"
                    id="scale"
                    min="0.7"
                    max="1.2"
                    step="0.05"
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
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
                <h4 className="text-xl font-semibold text-white-400">
                  Accesibilidad
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-white">Modo Alto Contraste:</span>
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
                      className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                      peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-500 
                                      rounded-full peer dark:bg-gray-700 
                                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                      after:bg-white after:border-gray-300 after:border 
                                      after:rounded-full after:h-5 after:w-5 after:transition-all 
                                      dark:border-gray-600 peer-checked:bg-yellow-400"
                    ></div>
                  </label>
                  <span className="text-white">
                    {highContrast ? "Activado" : "Desactivado"}
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
                  Restaurar Preferencias
                </button>
              </div>
            </div>
          )}

          {activeSection === "Ayuda" && (
            <div className="space-y-8 w-full bg-gray-800 px-8 py-6 rounded-lg shadow-inner">
              <h3 className="text-3xl text-white font-semibold mb-6 border-b border-gray-600 pb-2">
                Ayuda
              </h3>

              <div className="bg-gray-900 p-4 mt-6 rounded-lg border border-gray-700">
                <p className="text-white font-semibold">Estado del Sistema:</p>
                <p className="text-green-400 text-sm mt-1">
                  🟢 Todos los sistemas funcionan con normalidad.
                </p>
              </div>

              <button
                onClick={() =>
                  window.open(
                    "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448",
                    "_blank",
                  )
                }
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
              >
                <FaFilePdf className="text-red-400 text-xl" />
                Descargar Manual de Usuario
              </button>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">
                  Preguntas Frecuentes
                </h4>

                {[
                  {
                    pregunta: "¿Cómo creo un nuevo estudio?",
                    respuesta:
                      'Ve a la sección "Mis Estudios" y haz click en "Crear Estudio".',
                  },
                  {
                    pregunta: "¿Cómo cambio mi contraseña?",
                    respuesta:
                      'Ve a "Configuración" > "Cuenta" > "Modificar Contraseña".',
                  },
                  {
                    pregunta: "¿Dónde puedo ver los resultados de la IA?",
                    respuesta:
                      "Una vez que el análisis finaliza, verás la imagen segmentada y los resultados en la vista del estudio.",
                  },
                  {
                    pregunta: "¿Puedo descargar un informe PDF?",
                    respuesta:
                      'Sí. Una vez generado, haz clic en "Descargar Informe" en el menú del estudio. Esto te abrirá el informe en una nueva pestaña, donde podrás descargarlo, modificarlo ....',
                  },
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="group bg-gray-900 p-4 rounded-lg border border-gray-700 cursor-pointer transition-all"
                  >
                    <p className="text-white font-semibold">{faq.pregunta}</p>
                    <p className="text-gray-300 text-sm mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                      {faq.respuesta}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-white mb-2">
                  ¿Tienes alguna duda? Escribe a:
                </p>
                <a
                  href="mailto:soporte@hcc-ai.com"
                  className="text-blue-400 underline hover:text-blue-600"
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
