import { useState, useEffect } from "react";
import { Reminder } from "../models/Calendar";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

export const useCalendarViewModel = () => {
  const db = getFirestore();
  const auth = getAuth();

  const [user, setUser] = useState<any>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newReminder, setNewReminder] = useState("");
  const [reminderTime, setReminderTime] = useState("12:00");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRemindersRef = collection(
          db,
          "hcc_ai_users",
          currentUser.uid,
          "reminders",
        );
        const snapshot = await getDocs(userRemindersRef);
        const userReminders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          done: doc.data().done ?? false,
        })) as Reminder[];
        setReminders(userReminders);
      }
    });
    return () => unsubscribe();
  }, []);

  const addReminder = async (time: string) => {
    if (!newReminder || !selectedDate || !user || !time) return;

    const reminder = {
      date: selectedDate.toDateString(),
      time,
      text: newReminder,
      done: false,
      createdAt: new Date(),
    };

    try {
      const remindersRef = collection(db, "hcc_ai_users", user.uid, "reminders");
      const docRef = await addDoc(remindersRef, reminder);
      setReminders([...reminders, { ...reminder, id: docRef.id }]);
      setNewReminder("");
      toast.success("Recordatorio añadido");
    } catch {
      toast.error("No se pudo guardar el recordatorio");
    }
  };



  const deleteReminder = async (reminderId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "hcc_ai_users", user.uid, "reminders", reminderId));
      setReminders(reminders.filter((r) => r.id !== reminderId));
      toast.success("Recordatorio eliminado");
    } catch {
      toast.error("No se pudo eliminar el recordatorio");
    }
  };

  const toggleReminderDone = async (reminderId: string) => {
    if (!user) return;
    const updatedReminders = reminders.map((r) =>
      r.id === reminderId ? { ...r, done: !r.done } : r,
    );
    setReminders(updatedReminders);
    try {
      const reminderRef = doc(db, "hcc_ai_users", user.uid, "reminders", reminderId);
      const reminder = updatedReminders.find((r) => r.id === reminderId);
      if (reminder) {
        await updateDoc(reminderRef, { done: reminder.done });
      }
    } catch {
      toast.error("Error al actualizar el recordatorio");
    }
  };

  return {
    reminders,
    user,
    setUser,
    selectedDate,
    setSelectedDate,
    newReminder,
    setNewReminder,
    addReminder,
    deleteReminder,
    toggleReminderDone,
  };
};
