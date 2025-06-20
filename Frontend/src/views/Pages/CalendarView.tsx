import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import NavbarSecond from "../Components/InsideNavbar.tsx";
import ProfileModal from "../Components/ProfileModal.tsx";
import SettingsModal from "../Components/SettingsModal.tsx";
import { useCalendarViewModel } from "../../viewmodels/useCalendarViewModel.ts";
import Footer from "../Components/InsideFooter.tsx";
import usePreventZoom from "../Components/usePreventZoom.tsx";
import TimePicker from "react-time-picker";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import Assistant from "./AssistantView.tsx";

import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import "../../calendar-overrides.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const CalendarPageView: React.FC = () => {
  const {
    user,
    userData,
    setUser,
    reminders,
    selectedDate,
    setSelectedDate,
    newReminder,
    setNewReminder,
    addReminder,
    deleteReminder,
    toggleReminderDone,
    loadRemindersForMonth,
  } = useCalendarViewModel();

  const [value, setValue] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [reminderTime, setReminderTime] = useState<string>("12:00");

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "es",
  );
  const [scale, setScale] = useState<number>(
    parseFloat(localStorage.getItem("uiScale") || "1"),
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true",
  );
  const { t } = useTranslation("global");

  usePreventZoom(true, true);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
  }, [scale]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
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

      <main className="pt-24 px-6 flex-grow">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
              Calendario
            </h2>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-sm bg-blue-300 dark:bg-blue-600 text-gray-800 dark:text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-500"
              title="¿Qué significan los colores?"
            >
              ?
            </button>
          </div>
          <Calendar
            onChange={(date) => {
              setValue(date as Date);
              setSelectedDate(date as Date);
            }}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (user && activeStartDate) {
                loadRemindersForMonth(
                  user.uid,
                  activeStartDate.getFullYear(),
                  activeStartDate.getMonth(),
                );
              }
            }}
            value={value}
            className="mx-auto"
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;
              const dateStr = date.toDateString();
              const dayReminders = reminders.filter((r) => r.date === dateStr);
              if (dayReminders.length === 0) return null;
              const allDone = dayReminders.every((r) => r.done);
              return allDone ? "highlight-complete" : "highlight-reminder";
            }}
          />

          {selectedDate && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Añadir recordatorio para {selectedDate.toDateString()}
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  className="flex-grow px-4 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Escribe el recordatorio..."
                />
                <TimePicker
                  onChange={(value) => setReminderTime(value ?? "")}
                  value={reminderTime}
                  disableClock
                  clearIcon={null}
                  format="HH:mm"
                  hourPlaceholder="hh"
                  minutePlaceholder="mm"
                  className="rounded-md border dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
                />
                <button
                  onClick={() => addReminder(reminderTime)}
                  className="bg-yellow-500 dark:bg-yellow-500 text-black px-4 py-2 rounded-md font-bold hover:bg-yellow-400"
                >
                  Añadir
                </button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Recordatorios
            </h3>
            <ul className="space-y-2">
              {reminders
                .filter((r) => r.date === value.toDateString())
                .map((reminder) => (
                  <li
                    key={reminder.id}
                    className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        id={`reminder-${reminder.id}`}
                        type="checkbox"
                        checked={reminder.done}
                        onChange={() => toggleReminderDone(reminder.id)}
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500 transition-all"
                        aria-label={`Marcar ${reminder.text} como ${reminder.done ? "pendiente" : "completado"}`}
                      />
                      <label
                        htmlFor={`reminder-${reminder.id}`}
                        className={`cursor-pointer flex flex-col ${
                          reminder.done
                            ? "line-through opacity-50 text-gray-800 dark:text-white"
                            : "text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        <span>{reminder.text}</span>
                        {reminder.time && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            🕒 {reminder.time}
                          </span>
                        )}
                      </label>
                    </div>

                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm px-2 py-1 rounded transition-colors"
                      title="Eliminar recordatorio"
                    >
                      ✕
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full relative">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white bg-blue"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                Leyenda del calendario
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded bg-yellow-500 border border-gray-400"></span>
                  <span className="text-gray-700 dark:text-gray-200">
                    Días con tareas pendientes
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded bg-emerald-500 border border-gray-400"></span>
                  <span className="text-gray-700 dark:text-gray-200">
                    Días con todas las tareas completadas
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CalendarPageView;
