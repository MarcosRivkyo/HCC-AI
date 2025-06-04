import React from "react";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import logoUSALsinBG from "../../assets/images/logo_usal_removebg.png";
import logoHPsinBG from "../../assets/images/logoHP-removebg.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white relative p-4 w-full mt-auto shadow-lg rounded-t-lg mb-0">
      {/* Logos a la izquierda, ligeramente desplazados */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex space-x-4 items-center">
        <a
          href="https://www.usal.es"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={logoUSALsinBG}
            alt="Logo USAL"
            className="w-16 h-auto cursor-pointer"
          />
        </a>
        <a
          href="https://www.hp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={logoHPsinBG}
            alt="Logo HP"
            className="w-16 h-auto cursor-pointer"
          />
        </a>
      </div>

      {/* Texto centrado */}
      <div className="text-center text-sm">
        © 2025 HCC-AI
      </div>
    </footer>
  );
};

export default Footer;
