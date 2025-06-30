import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import global_en from "../assets/translations/en/global.json";
import global_es from "../assets/translations/es/global.json";
import global_fr from "../assets/translations/fr/global.json";
import global_de from "../assets/translations/de/global.json";

i18n.use(initReactI18next).init({
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

export default i18n;
