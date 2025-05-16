import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

import global_en from "./assets/translations/en/global.json";
import global_es from "./assets/translations/es/global.json";
import global_fr from "./assets/translations/fr/global.json";
import global_de from "./assets/translations/de/global.json";
import Dashboard from "./components/Pages/Dashboard.tsx";
import Login from "./components/Auth/Login.tsx";
import Signup from "./components/Auth/Signup.tsx";
import AuthRoute from "./components/Auth/AuthRoute.tsx";
import Assistant from "./components/Pages/Assistant.tsx";
import PredictImage from "./components/Pages/PredictImage.tsx";
import EstudioDetalle from "./components/Pages/EstudioDetalle.tsx";
import MisEstudios from "./components/Pages/MisEstudios.tsx";
import Models from "./components/Pages/Models.tsx";

i18next
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: localStorage.getItem("language") || "es", 
    fallbackLng: "es", 
    resources: {
      es: { global: global_es },
      en: { global: global_en },
      fr: { global: global_fr },
      de: { global: global_de },
    },
  });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const storedTheme = localStorage.getItem("theme") || "light";
if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}




root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <Router>
        <Routes>

          {/* públicas */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>}/>
          <Route path="/signup" element={<Signup />} />

          {/* privadas */}
          <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/assistant" element={<AuthRoute><Assistant /></AuthRoute>} />
          <Route path="/editar-imagen" element={<AuthRoute><PredictImage /></AuthRoute>} />
          <Route path="/estudio/:id" element={<AuthRoute><EstudioDetalle /></AuthRoute>} />
          <Route path="/predict" element={<AuthRoute><PredictImage /></AuthRoute>} />
          <Route path="/my-studies" element={<AuthRoute><MisEstudios /></AuthRoute>} />
          <Route path="/models" element={<AuthRoute><Models /></AuthRoute>} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
          
          </Routes>
      </Router>
    </I18nextProvider>
  </React.StrictMode>,
);
