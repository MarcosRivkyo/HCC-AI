import React from "react";
import { FiFileText, FiExternalLink } from "react-icons/fi";
import Footer from "../Components/AppFooter";

const pdfUrls = [
  { name: "Memoria del TFG", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" },
  { name: "Anexo I – Plan de Proyecto Software", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" },
  { name: "Anexo II – Especificación de Requisitos Software", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" },
  { name: "Anexo III – Análisis del Sistema Software", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" },
  { name: "Anexo IV – Diseño del Sistema Software", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" },
  { name: "Anexo V – Documentación del Código Fuente", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" },
  { name: "Anexo VI – Manual del Usuario", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" },
  { name: "Anexo VII – Desarrollo de la Inteligencia Artificial", url: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2FHCC-AI_ManualDeUsuario.pdf?alt=media&token=0b548417-2aa1-4456-8424-32de08edd448" }
];

const externalLinks = [
  { name: "Documentación Técnica del Backend", url: "https://hcc-ai-backend-1084523848624.europe-west2.run.app/docs" },
  { name: "Documentación Técnica del Frontend", url: "/docs/index.html" },
];

const DocumentationPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Contenido principal */}
      <div className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-center mb-10">Documentación</h1>

            <div className="flex justify-center gap-6 mb-8 flex-wrap">
            {externalLinks.map((link, idx) => (
                <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
                >
                <FiExternalLink size={18} />
                {link.name}
                </a>
            ))}
            </div>


        <hr className="border-t border-gray-300 dark:border-gray-600 my-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pdfUrls.map((doc, idx) => (
            <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-xl transition"
            >
                <FiFileText className="text-blue-500 mb-2" size={24} />
                <p className="font-semibold truncate mb-2">{doc.name}</p>
                <iframe
                src={`${doc.url}#zoom=30`}
                title={doc.name}
                className="w-full h-48 rounded border mb-2"
                />
                <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                Ver documento
                </a>
            </div>
            ))}
        </div>
      </div>

      {/* Footer al fondo */}
      <Footer />
    </div>
  );
};

export default DocumentationPage;
