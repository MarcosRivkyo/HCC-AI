import { useHomePageViewModel } from "../../viewmodels/useHomePageViewModel.ts";

import Assistant from "./AssistantView.tsx";
import usePreventZoom from "../Components/usePreventZoom.tsx";
import EstudiosRecientes from "../Components/RecentStudies.tsx";
import ModelosDisponibles from "../Components/AvailableModels.tsx";
import ImageCarrousel from "../Components/ImageCarrousel.tsx";
import NavbarSecond from "../Components/InsideNavbar.tsx";
import ProfileModal from "../Components/ProfileModal.tsx";
import SettingsModal from "../Components/SettingsModal.tsx";
import Footer from "../Components/InsideFooter.tsx";
import UsefulLinks from "../Components/UsefulLinks.tsx";

import { useTranslation } from "react-i18next";

import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";

import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Dashboard = () => {
  const {
    user,
    userData,
    isProfileOpen,
    setIsProfileOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    showAssistant,
    setShowAssistant,
    theme,
    setTheme,
    language,
    setLanguage,
    scale,
    setScale,
    highContrast,
    setHighContrast,
    claveEstudios,
    handleImageSelect,
  } = useHomePageViewModel();

  const { t } = useTranslation("global");

  usePreventZoom(true, true);

  return (
    <div
      className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      <NavbarSecond
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAssistantClick={() => setShowAssistant(!showAssistant)}
        isPatientView={false}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
        user={user}
      />

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        scale={scale}
        setScale={setScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        userData={userData}
      />

      <div
        className={`flex-1 flex-col h-screen pt-24 px-6 bg-gray-300 text-black dark:bg-gray-800 dark:text-white`}
      >
        <div
          className={`flex pt-10 pb-10  px-6 h-full bg-gray-300 text-black dark:bg-gray-800 dark:text-white`}
        >
          <div className="relative z-50">
            <div
              className={`fixed top-20 bottom-10 right-0 w-[30rem] bg-gray-800 text-white shadow-lg rounded-l-2xl p-4 transition-all duration-500 ease-in-out ${
                showAssistant ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold p-4 border-b border-gray-700">
                  🧠 {t("assistant.title")}
                </h2>
                <button
                  onClick={() => setShowAssistant(false)}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-md"
                  title="Cerrar"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <Assistant />
            </div>

            {!showAssistant && (
              <button
                onClick={() => setShowAssistant(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition-all duration-300 ease-in-out"
                title="Abrir asistente"
              >
                <ChatBubbleLeftIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="w-1/2 h-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700 mr-6 flex flex-col space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("dashboard.recent_studies")}
              </h2>
              <main className="flex-1 overflow-auto">
                <EstudiosRecientes key={claveEstudios} />
              </main>
            </div>

            {user && (
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-4">
                <UsefulLinks userId={user.uid} />
              </div>
            )}
          </div>

          {}
          <div className="w-1/2 h-full flex flex-col gap-6">
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("dashboard.image_editor")}
              </h2>
              <div className="w-full h-full">
                <ImageCarrousel onImageSelect={handleImageSelect} />
              </div>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("dashboard.available_models")}
              </h2>
              <main className="flex-1 overflow-auto">
                <ModelosDisponibles />
              </main>
            </div>
          </div>
        </div>

        {}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
