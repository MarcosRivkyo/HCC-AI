import React from 'react';
import './index.css';

import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import axios from "axios";
import i18next from 'i18next';


import ImageSlider from "./components/UI/ImageSlider2.tsx";
import { TextEffectDemo } from "./components/UI/TextEffectDemo.tsx";
import Logout from "./components/Auth/Logout.tsx";
import Footer from "./components/UI/Footer.tsx";
import Navbar from './components/UI/Navbar.tsx';

import logoHCC_AI from "./assets/images/logo_hcc_ai.jpg";
import ia_cancer from "./assets/images/ia_cancer.png";
import hepato_eco from "./assets/images/hepatic_eco.png";
import logo_user from "./assets/images/logo_user.png";
import spanishFlag from "./assets/images/spanish_language.png";
import englishFlag from "./assets/images/english_language.png";
import analisis_medico  from "./assets/images/analisis_medico.png";


import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { FaPython, FaReact, FaAngular, FaCogs, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { SiPytorch, SiOpencv, SiSharp } from "react-icons/si";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaMicroscope, FaBrain, FaHospital, FaChartLine, FaLaptopMedical, FaSearch } from "react-icons/fa";








const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};


const firebaseConfig = {
  apiKey: "AIzaSyDOJoSj4BPVEORJDgIN5H-TJN9JvXQdEnA",
  authDomain: "hcc-ai.firebaseapp.com",
  projectId: "hcc-ai",
  storageBucket: "hcc-ai.firebasestorage.app",
  messagingSenderId: "822292218390",
  appId: "1:822292218390:web:5dffe0efc7b45a382a6b37"
};


initializeApp(firebaseConfig);






const LanguageToggleButton: React.FC = () => {
  const [isSpanish, setIsSpanish] = useState<boolean>(i18next.language === 'es');

  const toggleLanguage = () => {
    const newLanguage = isSpanish ? 'en' : 'es';
    i18next.changeLanguage(newLanguage);
    setIsSpanish(!isSpanish);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <button
        onClick={toggleLanguage}
        className="w-16 h-16 rounded-full shadow-lg overflow-hidden border-2 border-white"
      >
        <img 
          src={isSpanish ? spanishFlag : englishFlag} 
          alt={isSpanish ? 'Español' : 'English'}
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};



const ContactButton: React.FC = () => {

  const [selectedSection, setSelectedSection] = useState<string>("home");

  const scrollToSection = (id: string) => {
    setSelectedSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };



  return (
    <div className="fixed bottom-5 right-5 z-50">
      <a onClick={() => scrollToSection('contact')} className="bg-red-500 text-white p-4 rounded-full shadow-lg flex justify-center items-center animate-bounce hover:bg-red-700">
        <FaPhone size={40} />
      </a>
    </div>
  );
};




const Home: React.FC = () => {
  const [showFirstTextEffect, setShowFirstTextEffect] = useState(false);
  const [showSecondTextEffect, setShowSecondTextEffect] = useState(false);

  useEffect(() => {
    // Mostrar el primer efecto al cargar el componente
    const timer1 = setTimeout(() => {
      setShowFirstTextEffect(true); // Mostrar el primer efecto
    }, 500); // Espera 500 ms para que el primer efecto aparezca

    // Mostrar el segundo efecto después del primer
    const timer2 = setTimeout(() => {
      setShowSecondTextEffect(true); // Mostrar el segundo efecto después de 3 segundos
    }, 3500); // Espera 3500 ms para mostrar el segundo

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section id="home" className="text-center text-2xl pt-16 p-10 relative h-screen">
      {/* Contenedor del texto - Absoluto sobre el slider */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div className="flex flex-col items-center justify-center bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-[100px] font-bold mb-6">
            <span className="text-white">HCC-</span>
            <span className="text-red-500">AI</span>
          </h1>

          {/* Primer TextEffectDemo */}
          {showFirstTextEffect && <TextEffectDemo lang="es" />}

          {/* Segundo TextEffectDemo debajo del primero */}
          {showSecondTextEffect && <TextEffectDemo lang="eng" />}
        </div>
      </div>

      {/* Slider en el fondo */}
      <div className="absolute inset-0 z-10">
        <ImageSlider />
      </div>
    </section>
  );
};





const About: React.FC = () => {
  const { t } = useTranslation("global");

  return (
    <motion.section
      id="objectives"
      className="text-center text-white bg-gradient-to-b from-black to-gray-900 py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <h2 className="text-4xl font-extrabold text-green-400 mb-6">{t("sections.objectives")}</h2>
      <p className="text-lg max-w-3xl mx-auto mb-10">{t("main.description")}</p>

      {/* Sección de imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="relative group">
          <img
            src={ia_cancer}
            alt={t("sections.ai_detection")}
            className="w-full h-64 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition duration-300"
          />
          <p className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md">
            {t("sections.ai_detection")}
          </p>
        </div>

        <div className="relative group">
          <img
            src={hepato_eco}
            alt={t("sections.ultrasound")}
            className="w-full h-64 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition duration-300"
          />
          <p className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md">
            {t("sections.ultrasound")}
          </p>
        </div>

        <div className="relative group">
          <img
            src={analisis_medico}
            alt={t("sections.medical_analysis")}
            className="w-full h-64 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition duration-300"
          />
          <p className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md">
            {t("sections.medical_analysis")}
          </p>
        </div>
      </div>

      {/* Beneficios del proyecto */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold text-green-300 mb-4">{t("sections.key_benefits")}</h3>
        <ul className="text-lg space-y-3">
          <li className="flex items-center justify-center">{t("sections.benefit_1")}</li>
          <li className="flex items-center justify-center">{t("sections.benefit_2")}</li>
          <li className="flex items-center justify-center">{t("sections.benefit_3")}</li>
          <li className="flex items-center justify-center">{t("sections.benefit_4")}</li>
        </ul>
      </div>
    </motion.section>
  );
};


const Services: React.FC = () => {

  const { t } = useTranslation("global");

  return (

    <motion.section id="services" className="text-center text-white bg-gray-900 py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
      <h2 className="text-4xl font-bold mb-6 text-blue-400">{t("sections.our_services")}</h2>
      <p className="text-lg max-w-3xl mx-auto text-gray-300">
        {t("sections.services_description")}
      </p>

      {/* Contenedor de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 max-w-6xl mx-auto">
        
        {/* Servicio 1 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <FaMicroscope className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("sections.ai_diagnosis")}</h3>
          <p className="text-gray-300">
              {t("sections.ai_diagnosis_description")}
          </p>
        </div>

        {/* Servicio 2 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <FaBrain className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("sections.advanced_nn")}</h3>
          <p className="text-gray-300">
              {t("sections.advanced_nn_description")}
          </p>
        </div>

        {/* Servicio 3 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <FaHospital className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("sections.medical_collaboration")}</h3>
          <p className="text-gray-300">
              {t("sections.medical_collaboration_description")}
          </p>
        </div>

        {/* Servicio 4 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <FaLaptopMedical className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("sections.interactive_platform")}</h3>
          <p className="text-gray-300">
              {t("sections.interactive_platform_description")}
          </p>
        </div>

        {/* Servicio 5 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <FaChartLine className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("sections.tumor_evaluation")}</h3>
          <p className="text-gray-300">
              {t("sections.tumor_evaluation_description")}
          </p>
        </div>

        {/* Servicio 6 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <FaSearch className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("sections.r_and_d")}</h3>
          <p className="text-gray-300">
              {t("sections.r_and_d_description")}
          </p>
        </div>

      </div>
    </motion.section>
  );
};




const Technology: React.FC = () => {
  const { t } = useTranslation("global");

  return (
    <motion.section id="technology" className="text-center text-white bg-gradient-to-b from-gray-900 to-black py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
      <h2 className="text-4xl font-bold mb-6 text-green-400">{t('sections.technologies')}</h2>
      <p className="text-lg mb-10 mx-auto max-w-3xl">
        {t('sections.ai_description')}
      </p>

      {/* Sección de tecnologías en tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
          <FaPython className="text-yellow-400 text-5xl mx-auto mb-4" />
          <SiPytorch className="text-red-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Python & PyTorch</h3>
          <p className="text-sm mt-2 text-gray-300">{t('sections.ai_python_description')}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
          <SiOpencv className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">{t('sections.opencv_title')}</h3>
          <p className="text-sm mt-2 text-gray-300">{t('sections.opencv_description')}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
          <FaReact className="text-blue-500 text-5xl mx-auto mb-4" />
          <FaAngular className="text-red-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">{t('sections.frontend_title')}</h3>
          <p className="text-sm mt-2 text-gray-300">{t('sections.frontend_description')}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
          <SiSharp className="text-purple-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">{t('sections.backend_title')}</h3>
          <p className="text-sm mt-2 text-gray-300">{t('sections.backend_description')}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300 col-span-1 sm:col-span-2">
          <FaCogs className="text-gray-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">{t('sections.integration_title')}</h3>
          <p className="text-sm mt-2 text-gray-300">{t('sections.integration_description')}</p>
        </div>
      </div>
    </motion.section>
  );
};



const Contact: React.FC = () => {

  const { t } = useTranslation("global");


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Activa el estado de carga
    setResponseMessage(""); // Borra mensajes anteriores

    try {
      const response = await axios.post("https://fastapi-project-1084523848624.europe-southwest1.run.app/send-email/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setResponseMessage(response.data.message); // Mensaje de éxito
    } catch (error) {
      setResponseMessage("Hubo un error al enviar el mensaje.");
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <section id="contact" className="text-center text-white bg-black py-20">
      <h2 className="text-4xl font-bold text-green-400 mb-6">{t("sections.contact_title")}</h2>
      <p className="text-lg max-w-3xl mx-auto mb-10">
          {t("sections.contact_description")}
      </p>



      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">

        <div className="mb-4">
          <label className="block text-gray-300 text-left text-lg">{t("input.name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mt-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-400"
            placeholder={t("input.name_placeholder")}
            required
          />
        </div>


        <div className="mb-4">
          <label className="block text-gray-300 text-left text-lg">{t("input.mail")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mt-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-400"
            placeholder={t("input.mail_placeholder")}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 text-left text-lg">{t("input.message")}</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 mt-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-400"
            rows={4}
            placeholder={t("input.message_placeholer")}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading} // Deshabilita el botón mientras carga
        >
          {isLoading ? t("input.submiting") : t("input.submit")}

        </button>
      </form>



      {/* Mensaje de respuesta */}
      {responseMessage && <p className="mt-6 text-green-400">{responseMessage}</p>}
    </section>
  );
};







function App(){

  return (
    <div className="bg-black text-white min-h-screen">

        <Navbar />
        <Home />
        <About />
        <Services />
        <Technology />
        <Contact />
        <ContactButton />
        <LanguageToggleButton />
        <Footer />

    </div>
  );
};

export default App;


