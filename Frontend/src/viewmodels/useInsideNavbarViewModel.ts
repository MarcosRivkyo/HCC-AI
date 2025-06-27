// src/viewmodels/useNavbarSecondViewModel.ts

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDAO } from "../data/dao/AuthDAO";
import { UserDAO } from "../data/dao/UserDAO";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

type Reminder = {
  id: string;
  date: string;
  text: string;
  done: boolean;
};

export const useNavbarSecondViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [activePath, setActivePath] = useState<string>(
    window.location.pathname,
  );
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation("global");

  useEffect(() => {
    const unsubscribe = AuthDAO.subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userData = await UserDAO.getUserById(currentUser.uid);
        setUserData(userData);
        await fetchReminders(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchReminders = async (uid: string) => {
    const snapshot = await getDocs(
      collection(db, "hcc_ai_users", uid, "reminders"),
    );
    const loadedReminders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      done: doc.data().done ?? false,
    })) as Reminder[];

    setReminders(loadedReminders);
  };

  useEffect(() => {
    const handleLangChange = () => setActivePath((p) => p);
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    user,
    userData,
    reminders,
    activePath,
    setActivePath,
    isOpen,
    setIsOpen,
    menuRef,
    navigate,
  };
};
