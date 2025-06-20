import { FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import logoUSAL from "../../assets/images/logo_usal.png";
import logoHP from "../../assets/images/logoHP.png";

const Footer: React.FC = () => {
  const [t] = useTranslation("global");

  return (
    <footer className="bg-black text-white py-8 mt-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <img
            src={logoHCC_AI}
            alt="Logo HCC-AI"
            className="w-32 mx-auto md:mx-0"
          />
          <p className="mt-2 text-sm text-gray-400">
            {t("footer.description")}
          </p>
        </div>

        <div className="flex space-x-6 text-sm">
          <a
            href="https://www.usal.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logoUSAL}
              alt="Logo USAL"
              className="w-64 mx-auto md:mx-0"
            />
          </a>

          <a
            href="https://hpscds.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logoHP} alt="Logo HP" className="w-64 mx-auto md:mx-0" />
          </a>
        </div>

        <div className="flex space-x-4 mt-6 md:mt-0">
          <a
            href="mailto:marcos.rivkyo@gmail.com"
            className="text-gray-400 hover:text-white"
            title="Correo: marcos.rivkyo@usal.es"
          >
            <FaEnvelope size={20} />
          </a>

          <a
            href="https://www.linkedin.com/in/marcos-rivas-kyoguro-7ab518248"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
            title="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>

          <a
            href="https://github.com/MarcosRivkyo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
            title="GitHub"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} {t("footer.copyright")}
      </div>
    </footer>
  );
};

export default Footer;
