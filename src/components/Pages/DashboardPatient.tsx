import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import EstudiosRecientesPaciente from "../UI/PatientRecentStudies.tsx";
import { useTranslation } from "react-i18next";
import NavbarSecond from "../UI/InsideNavbar.tsx";
import ProfileModal from "../UI/ProfileModal.tsx";
import SettingsModal from "../UI/SettingsModal.tsx";
import NavbarPatient from "../UI/NavbarPatient.tsx";
import CalendarViewPatient from "./CalendarViewPatient.tsx";
import usePreventZoom from "../UI/usePreventZoom.tsx";
import Footer from "../UI/InsideFooter.tsx";
import UsefulLinks from "../UI/UsefulLinks";
import logoUSALsinBG from "../../assets/images/logo_usal_removebg.png";
import logoHPsinBG from "../../assets/images/logoHP-removebg.png";
const DashboardPatient = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [claveEstudios, setClaveEstudios] = useState(Date.now());
  const { t } = useTranslation("global");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [activeSection, setActiveSection] = useState("Cuenta");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "es",
  );
  const [scale, setScale] = useState<number>(
    parseFloat(localStorage.getItem("uiScale") || "1"),
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true",
  );
  const auth = getAuth();
  const db = getFirestore();
  usePreventZoom(true, true);

  useEffect(() => {
    // Escala
    document.documentElement.style.setProperty("zoom", scale.toString());
    localStorage.setItem("uiScale", scale.toString());
  }, [scale]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "hcc_ai_users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No se encontró el documento del usuario.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <NavbarPatient
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
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
          {/* Grid con estudios y calendario */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                {t("dashboard.recent_studies")}
              </h2>
              <EstudiosRecientesPaciente key={claveEstudios} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                {t("navbar.calendar")}
              </h2>
              <CalendarViewPatient />
            </div>
          </div>

          {/* Useful Links en toda la fila, con mismo ancho visual */}
          {user?.uid && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
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
