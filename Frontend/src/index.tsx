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
import HomePage from "./views/Pages/HomePage.tsx";
import HomePagePatient from "./views/Pages/HomePagePatient.tsx";
import Login from "./views/Auth/Login.tsx";
import Signup from "./views/Auth/Signup.tsx";
import AuthRoute from "./views/Auth/AuthRoute.tsx";
import Assistant from "./views/Pages/AssistantView.tsx";
import PredictImage from "./views/Pages/Editor.tsx";
import EstudioDetalle from "./views/Pages/DetailedStudy.tsx";
import MisEstudios from "./views/Pages/MyStudies.tsx";
import Models from "./views/Pages/Models.tsx";
import FilesPage from "./views/Pages/FileView.tsx";
import CalendarPage from "./views/Pages/CalendarView.tsx";
import DocumentationPage from "./views/Pages/Docs.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

i18next.use(initReactI18next).init({
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
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/documentation" element={<DocumentationPage />} />

          {/* privadas */}
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <HomePage />
              </AuthRoute>
            }
          />
          <Route
            path="/dashboard-patient"
            element={
              <AuthRoute>
                <HomePagePatient />
              </AuthRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <AuthRoute>
                <Assistant />
              </AuthRoute>
            }
          />
          <Route
            path="/editar-imagen"
            element={
              <AuthRoute>
                <PredictImage />
              </AuthRoute>
            }
          />
          <Route
            path="/estudio/:id"
            element={
              <AuthRoute>
                <EstudioDetalle />
              </AuthRoute>
            }
          />
          <Route
            path="/predict"
            element={
              <AuthRoute>
                <PredictImage />
              </AuthRoute>
            }
          />
          <Route
            path="/my-studies"
            element={
              <AuthRoute>
                <MisEstudios />
              </AuthRoute>
            }
          />
          <Route
            path="/models"
            element={
              <AuthRoute>
                <Models />
              </AuthRoute>
            }
          />
          <Route
            path="/files"
            element={
              <AuthRoute>
                <FilesPage />
              </AuthRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <AuthRoute>
                <CalendarPage />
              </AuthRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </I18nextProvider>
  </React.StrictMode>,
);
