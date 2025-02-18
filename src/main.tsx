import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Dashboard from './Dashboard';
import Login from './Login.tsx';
import Signup from './Signup.tsx';
import AuthRoute from './AuthRoute.tsx';
import logoHCC_AI from "./assets/logo_hcc_ai.jpg";
import ia_cancer from "./assets/ia_cancer.png";
import hepato_eco from "./assets/hepatic_eco.png";
import ImageSlider from "./ImageSlider2";

import analisis_medico  from "./assets/analisis_medico.png";


import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { motion } from "framer-motion";
import { useState } from "react";
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



const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 mt-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Logo y descripción */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <img src={logoHCC_AI} alt="Logo HCC-AI" className="w-32 mx-auto md:mx-0" />
          <p className="mt-2 text-sm text-gray-400">
            Innovación y tecnología para el futuro.
          </p>

        </div>

        {/* Enlaces rápidos */}
        <div className="flex space-x-6 text-sm">
          <a href="#home" className="hover:text-gray-300">Inicio</a>
          <a href="#objectives" className="hover:text-gray-300">Objetivos</a>
          <a href="#services" className="hover:text-gray-300">Servicios</a>
          <a href="#technology" className="hover:text-gray-300">Tecnología</a>
          <a href="#contact" className="hover:text-gray-300">Contacto</a>
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
        © {new Date().getFullYear()} HCC-AI. Todos los derechos reservados.
      </div>
    </footer>
  );
};


const Navbar: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("home");

  const scrollToSection = (id: string) => {
    setSelectedSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="bg-black p-6 text-white flex justify-between items-center fixed w-full top-0 z-50 shadow-lg cursor-pointer">
      <ul className="flex space-x-4 text-sm">
        {[
          { id: "home", label: "INICIO" },
          { id: "objectives", label: "OBJETIVOS" },
          { id: "services", label: "SERVICIOS" },
          { id: "technology", label: "TECNOLOGÍA" },
          { id: "contact", label: "CONTACTO" },
        ].map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`ml-20 transition-all duration-200 ${
                selectedSection === item.id ? "text-red-400 font-bold" : "hover:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src={logoHCC_AI} className="w-32 rounded-md" alt="HCC-AI Logo" onClick={() => scrollToSection("home")}/>
      </div>

      <div className="mr-40 space-x-4 flex">
      {/* Botón de Login */}
      <Link
        to="/login"
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
      >
        <FaSignInAlt className="mr-2" /> Login
      </Link>

      {/* Botón de Signup */}
      <Link
        to="/signup"
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg"
      >
        <FaUserPlus className="mr-2" /> Signup
      </Link>
    </div>
    </nav>
  );
};


const Home: React.FC = () => (
  <section id="home" className="text-center text-2xl pt-16 p-10 relative h-screen">
    {/* Contenedor del texto - Absoluto sobre el slider */}
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-5xl font-extrabold mb-4 text-red-500 drop-shadow-lg tracking-wide">
        ¡Bienvenido a HCC-AI!
        </h1>
        <p className="text-xl text-red-300 font-medium italic">
        Inteligencia Artificial para el diagnóstico del carcinoma hepatocelular
        </p>

    </div>

    {/* Slider en el fondo */}
    <div className="absolute inset-0 z-10">
      <ImageSlider />
    </div>
  </section>
);


const About: React.FC = () => (
  <motion.section id="objectives" className="text-center text-white bg-gradient-to-b from-black to-gray-900 py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>

    <h2 className="text-4xl font-extrabold text-green-400 mb-6">Objetivos</h2>
    
    <p className="text-lg max-w-3xl mx-auto mb-10">
      HCC-AI es un proyecto innovador que utiliza inteligencia artificial para la detección temprana del hepatocarcinoma 
      en imágenes de ecografía hepática, mejorando la precisión del diagnóstico y reduciendo la mortalidad asociada a esta enfermedad.
    </p>

  {/* Sección de imágenes */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
    <div className="relative group">
      <img 
        src={ia_cancer} 
        alt="Detección AI" 
        className="w-full h-64 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition duration-300"
      />
      <p className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md">
        Detección con IA
      </p>
    </div>

    <div className="relative group">
      <img 
        src={hepato_eco} 
        alt="Ecografía Hepática" 
        className="w-full h-64 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition duration-300"
      />
      <p className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md">
        Ecografía Hepática
      </p>
    </div>

    <div className="relative group">
      <img 
        src={analisis_medico} 
        alt="Análisis Médico" 
        className="w-full h-64 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition duration-300"
      />
      <p className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md">
        Análisis Médico
      </p>
    </div>
  </div>


    {/* Beneficios del proyecto */}
    <div className="mt-16 max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-green-300 mb-4">Beneficios Clave</h3>
      <ul className="text-lg space-y-3">
        <li className="flex items-center justify-center">
          ✅ Mayor precisión en la detección del hepatocarcinoma.
        </li>
        <li className="flex items-center justify-center">
          ✅ Diagnóstico más rápido y eficaz mediante IA.
        </li>
        <li className="flex items-center justify-center">
          ✅ Reducción de costos en pruebas médicas innecesarias.
        </li>
        <li className="flex items-center justify-center">
          ✅ Asistencia a profesionales de la salud en la toma de decisiones.
        </li>
      </ul>
    </div>
  </motion.section>
);



const Services: React.FC = () => (
  <motion.section id="services" className="text-center text-white bg-gray-900 py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
    <h2 className="text-4xl font-bold mb-6 text-blue-400">Nuestros Servicios</h2>
    <p className="text-lg max-w-3xl mx-auto text-gray-300">
      Proporcionamos herramientas avanzadas de diagnóstico basadas en redes neuronales convolucionales (CNNs) 
      para mejorar la precisión y detección temprana del carcinoma hepatocelular (HCC). 
      Nuestro modelo de inteligencia artificial analiza imágenes de ecografía hepática y datos clínicos para ayudar en la toma de decisiones médicas.
    </p>

    {/* Contenedor de Servicios */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 max-w-6xl mx-auto">
      
      {/* Servicio 1 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
        <FaMicroscope className="text-blue-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Diagnóstico con IA</h3>
        <p className="text-gray-300">
          Nuestro modelo basado en inteligencia artificial analiza ecografías hepáticas 
          para detectar y delimitar hepatocarcinomas con alta precisión.
        </p>
      </div>

      {/* Servicio 2 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
        <FaBrain className="text-blue-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Redes Neuronales Avanzadas</h3>
        <p className="text-gray-300">
          Utilizamos CNNs entrenadas con miles de imágenes médicas para mejorar la sensibilidad y especificidad del diagnóstico.
        </p>
      </div>

      {/* Servicio 3 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
        <FaHospital className="text-blue-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Colaboración Médica</h3>
        <p className="text-gray-300">
          Trabajamos con profesionales de la salud para validar nuestro modelo y asegurar su eficacia en entornos clínicos reales.
        </p>
      </div>

      {/* Servicio 4 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
        <FaLaptopMedical className="text-blue-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Plataforma Interactiva</h3>
        <p className="text-gray-300">
          Desarrollo de una aplicación web donde los médicos pueden cargar imágenes y recibir predicciones en tiempo real.
        </p>
      </div>

      {/* Servicio 5 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
        <FaChartLine className="text-blue-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Evaluación del Tumor</h3>
        <p className="text-gray-300">
          No solo detectamos el tumor, sino que analizamos su grado y evolución para ayudar en la toma de decisiones clínicas.
        </p>
      </div>

      {/* Servicio 6 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
        <FaSearch className="text-blue-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Investigación y Desarrollo</h3>
        <p className="text-gray-300">
          Buscamos mejorar continuamente nuestro modelo mediante nuevas técnicas de aprendizaje profundo y mayor cantidad de datos médicos.
        </p>
      </div>

    </div>
  </motion.section>
);





const Technology: React.FC = () => (
  <motion.section id="technology" className="text-center text-white bg-gradient-to-b from-gray-900 to-black py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
    <h2 className="text-4xl font-bold mb-6 text-green-400">Nuestra Tecnología</h2>
    <p className="text-lg mb-10 mx-auto max-w-3xl">
      En HCC-AI utilizamos herramientas de vanguardia para la detección de hepatocarcinomas mediante IA.
      Combinamos poderosos frameworks de inteligencia artificial con tecnologías frontend y backend de última generación.
    </p>

    {/* Sección de tecnologías en tarjetas */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
        <FaPython className="text-yellow-400 text-5xl mx-auto mb-4" />
        <SiPytorch className="text-red-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">IA con Python & PyTorch</h3>
        <p className="text-sm mt-2 text-gray-300">
          Modelos de redes neuronales avanzadas para la detección y segmentación de tumores hepáticos.
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
        <SiOpencv className="text-blue-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Procesamiento con OpenCV</h3>
        <p className="text-sm mt-2 text-gray-300">
          Mejora y análisis de imágenes de ecografía hepática para una mayor precisión en la detección.
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
        <FaReact className="text-blue-500 text-5xl mx-auto mb-4" />
        <FaAngular className="text-red-600 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Frontend en React & Angular</h3>
        <p className="text-sm mt-2 text-gray-300">
          Interfaces modernas e interactivas para la visualización de resultados médicos.
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
        <SiSharp className="text-purple-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Backend con C#</h3>
        <p className="text-sm mt-2 text-gray-300">
          Desarrollo de servicios robustos para la gestión y almacenamiento seguro de datos médicos.
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300 col-span-1 sm:col-span-2">
        <FaCogs className="text-gray-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Integración Completa</h3>
        <p className="text-sm mt-2 text-gray-300">
          Un sistema completo que combina IA, procesamiento de imágenes y desarrollo web para una solución innovadora en diagnóstico médico.
        </p>
      </div>

    </div>
  </motion.section>
);

const Contact: React.FC = () => (
  <motion.section id="contact" className="text-center text-white bg-black py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
    <h2 className="text-4xl font-bold text-green-400 mb-6">Contáctanos</h2>
    <p className="text-lg max-w-3xl mx-auto mb-10">
      Si deseas más información o colaborar con nosotros, no dudes en ponerte en contacto.
    </p>

    {/* Información de contacto */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <FaPhone className="text-green-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Teléfono</h3>
        <p className="text-gray-300 mt-2">+34 123 456 789</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <FaEnvelope className="text-green-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Correo Electrónico</h3>
        <p className="text-gray-300 mt-2">contacto@hcc-ai.com</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <FaMapMarkerAlt className="text-green-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Ubicación</h3>
        <p className="text-gray-300 mt-2">Madrid, España</p>
      </div>

    </div>

    {/* Formulario de contacto */}
    <form className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-300 text-left text-lg">Nombre</label>
        <input 
          type="text" 
          className="w-full p-3 mt-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-400"
          placeholder="Tu Nombre"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 text-left text-lg">Correo Electrónico</label>
        <input 
          type="email" 
          className="w-full p-3 mt-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-400"
          placeholder="tuemail@ejemplo.com"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 text-left text-lg">Mensaje</label>
        <textarea 
          className="w-full p-3 mt-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-400"
          rows={4}
          placeholder="Escribe tu mensaje aquí..."
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300"
      >
        Enviar Mensaje
      </button>
    </form>
  </motion.section>
);



const Main: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Home />
      <About />
      <Services />
      <Technology />
      <Contact />
      <Footer />
    </div>
  );
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
