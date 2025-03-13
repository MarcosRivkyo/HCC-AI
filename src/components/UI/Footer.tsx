import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg"; 


const Footer: React.FC = () => {

    const [ t, i18next ] = useTranslation("global");
  
    return (
      <footer className="bg-black text-white py-8 mt-20">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          {/* Logo y descripción */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <img src={logoHCC_AI} alt="Logo HCC-AI" className="w-32 mx-auto md:mx-0" />
            <p className="mt-2 text-sm text-gray-400">
              {t("footer.description")}
            </p>
  
  
  
          </div>
  
          {/* Enlaces rápidos */}
          <div className="flex space-x-6 text-sm">
            <a href="#home" className="hover:text-gray-300">{t("navbar.home")}</a>
            <a href="#objectives" className="hover:text-gray-300">{t("navbar.objective")}</a>
            <a href="#services" className="hover:text-gray-300">{t("navbar.services")}</a>
            <a href="#technology" className="hover:text-gray-300">{t("navbar.technologies")}</a>
            <a href="#contact" className="hover:text-gray-300">{t("navbar.contact")}</a>
          </div>
  
          {/* Redes sociales */}
          <div className="flex space-x-4 mt-6 md:mt-0">
            <a href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-white">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-white">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-white">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
  
        {/* Derechos de autor */}
        <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </footer>
    );
  };
  
export default Footer;