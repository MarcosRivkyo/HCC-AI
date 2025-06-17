import { useHomePageViewModel } from "../../viewmodels/useHomePageViewModel.ts";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import NavbarSecond from "../Components/InsideNavbar.tsx";
import ProfileModal from "../Components/ProfileModal.tsx";
import SettingsModal from "../Components/SettingsModal.tsx";
import CalendarViewPatient from "./CalendarViewPatient.tsx";
import usePreventZoom from "../Components/usePreventZoom.tsx";
import Footer from "../Components/InsideFooter.tsx";
import UsefulLinks from "../Components/UsefulLinks.tsx";
import EstudiosRecientesPaciente from "../Components/PatientRecentStudies.tsx";

const DashboardPatient = () => {
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
  } = useHomePageViewModel();

  const { t } = useTranslation("global");

  usePreventZoom(true, true);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
    localStorage.setItem("uiScale", scale.toString());
  }, [scale]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <NavbarSecond
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAssistantClick={() => setShowAssistant(!showAssistant)}
        isPatientView={true}
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

      <main className="flex-1 p-6 pt-28 bg-gradient-to-b from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                {t("dashboard.recent_studies")}
              </h2>
              <EstudiosRecientesPaciente key={claveEstudios} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                {t("navbar.calendar")}
              </h2>
              <CalendarViewPatient />
            </div>

          </div>

          {user?.uid && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
              <UsefulLinks userId={user.uid} />
            </div>
          )}

        </div>
      </main>


      <Footer />
    </div>
  );
};

export default DashboardPatient;
