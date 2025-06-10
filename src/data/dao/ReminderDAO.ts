import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const ReminderDAO = {
  async getRemindersByUserAndDate(uid: string, date: string) {
    const remindersRef = collection(db, "hcc_ai_users", uid, "reminders");
    const q = query(remindersRef, where("date", "==", date));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getRemindersByUserAndDateRange(uid: string, from: Date, to: Date) {
    const remindersRef = collection(db, "hcc_ai_users", uid, "reminders");
    const q = query(
      remindersRef,
      where("createdAt", ">=", from),
      where("createdAt", "<=", to),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async addReminder(uid: string, text: string, date: string, time: string) {
    const remindersRef = collection(db, "hcc_ai_users", uid, "reminders");
    return await addDoc(remindersRef, {
      text,
      date,
      time,
      done: false,
      createdAt: new Date(),
    });
  },

  async deleteReminder(uid: string, reminderId: string) {
    const reminderRef = doc(db, "hcc_ai_users", uid, "reminders", reminderId);
    return await deleteDoc(reminderRef);
  },

  async toggleReminderDone(uid: string, reminderId: string, done: boolean) {
    const reminderRef = doc(db, "hcc_ai_users", uid, "reminders", reminderId);
    return await updateDoc(reminderRef, { done });
  },
};
