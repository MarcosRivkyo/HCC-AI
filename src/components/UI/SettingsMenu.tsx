import { useState } from "react";

const SettingsMenu = ({ theme, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState("Cuenta");

  return (
    <div className="flex h-full">
      {/* Parte Izquierda (1/4) */}
      <div className="w-1/4 bg-gray-700 p-4 rounded-lg shadow-md h-full">
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
            onClick={() => setActiveSection("Pantalla")}
          >
            Pantalla
          </li>
        </ul>
      </div>

      {/* Separador */}
      <div className="border-l-2 border-gray-600 mx-4 h-full"></div>

      {/* Parte Derecha (3/4) */}
      <div className="w-3/4 p-4 h-full overflow-y-auto">
        {activeSection === "Cuenta" && (
          <div className="space-y-6">
            <h3 className="text-xl text-white">Opciones de Cuenta</h3>
            <ul className="space-y-4 text-white">
              <li className="hover:text-gray-300 cursor-pointer">Ver perfil</li>
              <li className="hover:text-gray-300 cursor-pointer">Modificar datos</li>
              <li className="hover:text-gray-300 cursor-pointer">Modificar contraseña</li>
              <li className="hover:text-gray-300 cursor-pointer">Eliminar cuenta</li>
            </ul>
          </div>
        )}

        {activeSection === "Preferencias" && (
          <div className="space-y-6">
            <h3 className="text-xl text-white">Preferencias</h3>
            {/* Aquí agregarías las opciones de Preferencias */}
          </div>
        )}

        {activeSection === "Pantalla" && (
          <div className="space-y-6">
            <h3 className="text-xl text-white">Pantalla</h3>
            {/* Aquí agregarías las opciones de Pantalla */}
          </div>
        )}

        {/* Opción de Cambiar Tema */}
        {activeSection === "Preferencias" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-lg text-white">Cambiar Tema</span>
              <button
                onClick={toggleTheme}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsMenu;
