import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";  

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";


import global_en from "./assets/translations/en/global.json";
import global_es from "./assets/translations/es/global.json";


import Dashboard from './Dashboard.tsx';
import Login from './components/Auth/Login.tsx';
import Signup from './components/Auth/Signup.tsx';
import AuthRoute from './AuthRoute.tsx';
import CompleteProfile from './components/Auth/CompleteProfile.tsx';
import Assistant from './components/Pages/Assistant.tsx';
import ImageEditor from "./ImageEditor.tsx";
import FabricEditor from "./FabricEditor.tsx";
import EstudioDetalle from "./EstudioDetalle.tsx";
import ImageCarrousel from "./ImageCarrousel.tsx";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "es", 
  resources: {
    es: {
      global: global_es,
    },
    en: {
      global: global_en,
    },
  },
});


const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>  
            <Router>  
                <Routes>  
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} /> #quite Authroute
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/editar-imagen" element={<FabricEditor />} />
                    <Route path="/estudio/:id" element={<EstudioDetalle />} /> 
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </I18nextProvider>
    </React.StrictMode>
);
