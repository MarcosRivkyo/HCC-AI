// src/views/Pages/CalendarViewPatient.tsx

import React, { useState } from "react";
import { useCalendarViewModel } from "../../viewmodels/useCalendarViewModel";

import Calendar from "react-calendar";
import { useTranslation } from "react-i18next";
import TimePicker from "react-time-picker";
import "react-calendar/dist/Calendar.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "../../calendar-overrides.css";
import { ToastContainer } from "react-toastify";

const CalendarViewPatient: React.FC = () => {
  const {
    reminders,
    selectedDate,
    setSelectedDate,
    newReminder,
    setNewReminder,
    addReminder,
    deleteReminder,
    toggleReminderDone,
  } = useCalendarViewModel();

  const [value, setValue] = useState<Date>(new Date());
  const [reminderTime, setReminderTime] = useState<string>("12:00");
  const { t } = useTranslation("global");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
      />

      <Calendar
        onChange={(date) => {
          setValue(date as Date);
          setSelectedDate(date as Date);
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
            {t("calendar.add_reminder_for")} {selectedDate.toDateString()}
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              className="flex-grow px-4 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
              placeholder={t("calendar.reminder_placeholder")}
            />
            <TimePicker
              onChange={(value) => setReminderTime(value ?? "")}
              value={reminderTime}
              disableClock
              clearIcon={null}
              format="HH:mm"
              className="rounded-md border dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white"
            />
            <button
              onClick={() => addReminder(reminderTime)}
              className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold hover:bg-yellow-400"
            >
              {t("calendar.add")}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          {t("calendar.reminders")}
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
                    type="checkbox"
                    checked={reminder.done}
                    onChange={() => toggleReminderDone(reminder.id)}
                    className="h-5 w-5"
                  />
                  <div
                    className={`flex flex-col ${reminder.done ? "line-through opacity-50" : ""}`}
                  >
                    <span>{reminder.text}</span>
                    {reminder.time && (
                      <span className="text-sm text-gray-500">
                        {reminder.time}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarViewPatient;
