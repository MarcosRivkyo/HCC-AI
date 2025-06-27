// src/viewmodels/useCalendarViewModel.ts

import { useState, useEffect } from "react";
import { AuthDAO } from "../data/dao/AuthDAO";
import { UserDAO } from "../data/dao/UserDAO";
import { ReminderDAO } from "../data/dao/ReminderDAO";

export const useCalendarViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [reminders, setReminders] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newReminder, setNewReminder] = useState("");

  useEffect(() => {
    const unsubscribe = AuthDAO.subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await UserDAO.getUserById(currentUser.uid);
        setUserData(data);
        const now = new Date();
        await loadRemindersForMonth(
          currentUser.uid,
          now.getFullYear(),
          now.getMonth(),
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const loadRemindersForMonth = async (
    uid: string,
    year: number,
    month: number,
  ) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const data = await ReminderDAO.getRemindersByUserAndDateRange(
      uid,
      firstDay,
      lastDay,
    );
    setReminders(data);
  };

  useEffect(() => {
    if (user && selectedDate) {
      loadRemindersForMonth(
        user.uid,
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
      );
    }
  }, [selectedDate]);

  const addReminder = async (time: string) => {
    if (!user || !newReminder.trim()) return;
    await ReminderDAO.addReminder(
      user.uid,
      newReminder.trim(),
      selectedDate.toDateString(),
      time,
    );
    await loadRemindersForMonth(
      user.uid,
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
    );
    setNewReminder("");
  };

  const deleteReminder = async (id: string) => {
    if (!user) return;
    await ReminderDAO.deleteReminder(user.uid, id);
    await loadRemindersForMonth(
      user.uid,
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
    );
  };

  const toggleReminderDone = async (id: string) => {
    if (!user) return;
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) return;
    await ReminderDAO.toggleReminderDone(user.uid, id, !reminder.done);
    await loadRemindersForMonth(
      user.uid,
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
    );
  };

  return {
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
  };
};
