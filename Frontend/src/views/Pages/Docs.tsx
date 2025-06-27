// src/views/Pages/Docs.tsx

import React from "react";
import { FiFileText, FiExternalLink, FiArrowLeft  } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/AppFooter";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import usePreventZoom from "../Components/usePreventZoom";
import { FaServer, FaReact, FaGitlab  } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import spanishFlag from "../../assets/images/spanish_language.png";
import englishFlag from "../../assets/images/english_language.png";
import frenchFlag from "../../assets/images/french_language.jpg";
import germanFlag from "../../assets/images/german_language.png";

const pdfUrls = [
  { name: "TFG_Report", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FMarcosRivasKyoguro.pdf?alt=media&token=ecd1cfa8-36bc-4c16-a5f3-856709534758" },
  { name: "Annex_I", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20I.%20Plan%20de%20Proyecto%20Software.pdf?alt=media&token=cbffcc6a-41ab-44eb-aa1b-8caeea609ca6" },
  { name: "Annex_II", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20II.%20Especificaci%C3%B3n%20de%20Requisitos%20Software.pdf?alt=media&token=323bbb2e-7c35-4f99-b28c-2be515b48a78" },
  { name: "Annex_III", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20III.%20An%C3%A1lisis%20del%20Sistema%20Software.pdf?alt=media&token=df3178e9-30b6-4b84-a4a5-c944528933e4" },
  { name: "Annex_IV", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20IV.%20Dise%C3%B1o%20del%20Sistema%20Software.pdf?alt=media&token=d1b518a4-2fa6-42dd-a599-efcc00674bc0" },
  { name: "Annex_V", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20V.%20Documentaci%C3%B3n%20T%C3%A9cnica%20de%20Programaci%C3%B3n.pdf?alt=media&token=a2b583ab-dcb0-4989-a9d7-d3095208d0ab" },
  { name: "Annex_VI", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20VI.%20Manual%20de%20Usuario.pdf?alt=media&token=f38dbfef-710a-4d5d-8603-6bd35cb4694c" },
  { name: "Annex_VII", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FAnexo%20VII.%20Desarrollo%20de%20la%20Inteligencia%20Artificial.pdf?alt=media&token=5f2e6138-eb8e-4589-9190-cbf912b843c6" }
];

const externalLinks = [
  {
    name: "Backend_Docs",
    url: "https://hcc-ai-backend-1084523848624.europe-west2.run.app/docs",
    icon: <FaServer size={22} />
  },
  {
    name: "Frontend_Docs",
    url: "/docs/index.html",
    icon: <FaReact size={22} className="text-cyan-400 " />
  },
    {
    name: "Source_Code",
    url: "https://gitlab.com/HP-SCDS/public/usal-hcc-ai/-/tree/reorganizacion-frontend-backend2?ref_type=heads", 
    icon: <FaGitlab size={22} className="text-orange-500" />
  }
];

const languages = [
  { code: "es", label: "Español", flag: spanishFlag },
  { code: "en", label: "English", flag: englishFlag },
  { code: "fr", label: "Français", flag: frenchFlag },
  { code: "de", label: "Deutsch", flag: germanFlag },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleChange = (lang: string) => {
    if (lang !== currentLang) i18next.changeLanguage(lang);
  };

  return (
    <div className="flex space-x-2">
      {languages.map(({ code, label, flag }) => {
        const isSelected = code === currentLang;
        return (
          <button
            key={code}
            onClick={() => handleChange(code)}
            className={`${
              isSelected
                ? "w-10 h-10 border-2 border-red-600 ring-2 ring-red-500"
                : "w-8 h-8 border border-gray-300 hover:border-red-400"
            } rounded-full overflow-hidden transition-all duration-200 ease-in-out`}
            title={label}
          >
            <img src={flag} alt={label} className="w-full h-full object-cover" />
          </button>
        );
      })}
    </div>
  );
};

const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();
  const [t] = useTranslation("global");
  usePreventZoom(true, true);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="bg-black py-4 px-6 shadow-md flex items-center justify-between">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-full shadow transition duration-300"
        >
          <FiArrowLeft size={18} />
          {t("documentation.go_back")}
        </button>


        <img
          src={logoHCC_AI}
          alt="HCC-AI Logo"
          className="h-12 cursor-pointer rounded-xl hover:scale-105 transition-transform"
          onClick={() => navigate("/")}
        />


        <LanguageSelector />
      </nav>


      <div className="flex-grow p-8">
        <h1 className="text-5xl font-bold text-center my-12">{t("documentation.documentation")}</h1>


        <div className="flex justify-center gap-6 flex-wrap mb-12">
          {externalLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gradient-to-r from-black to-blue-900 hover:from-gray-900 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span className="bg-black text-white p-2 rounded-full shadow-md">
                {link.icon}
              </span>
              {t(`documentation.${link.name}`)}
            </a>
          ))}
        </div>

        <hr className="border-gray-600 my-12" />


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pdfUrls.map((doc, idx) => (
            <div key={idx} className="bg-gray-800 rounded-2xl p-5 shadow hover:shadow-2xl transition-all">
              <p className="font-semibold truncate mb-3">{t(`documentation.${doc.name}`)}</p>
              <iframe
                src={`${doc.url}#zoom=30`}
                title={t(`documentation.${doc.name}`)}
                className="w-full h-48 rounded border mb-3"
              />
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-blue-400 hover:underline"
              >
                {t("documentation.view_doc")}
              </a>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DocumentationPage;