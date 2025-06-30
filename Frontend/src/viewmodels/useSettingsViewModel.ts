// src/viewmodels/useSettingsViewModel.ts

import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { UserDAO } from "../data/dao/UserDAO";
import { toast } from "react-toastify";
import { User } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export function useSettingsViewModel(userData: any) {
  const uid = userData?.uid || auth.currentUser?.uid;

  const [activeSection, setActiveSection] = useState("Cuenta");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light",
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [userName, setUserName] = useState(userData?.userName || "");
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [filteredUserList, setFilteredUserList] = useState<any[]>([]);
  const [systemActive, setSystemActive] = useState<boolean | null>(null);
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(
    userData?.recepcionRecordatorio ?? true,
  );

  useEffect(() => {
    const fetchSystemStatus = async () => {
      const statusDoc = await getDoc(doc(db, "hcc_ai_status", "global_status"));
      if (statusDoc.exists()) {
        setSystemActive(statusDoc.data().active ?? false);
      }
    };
    fetchSystemStatus();
  }, []);

  useEffect(() => {
    if (userData?.recepcionRecordatorio !== undefined) {
      setDailyReminderEnabled(userData.recepcionRecordatorio);
    }
  }, [userData]);

  useEffect(() => {
    const filtered = userList.filter((user) => {
      const nameMatch =
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(busquedaNombre.toLowerCase()) ||
        user.email?.toLowerCase().includes(busquedaNombre.toLowerCase());

      const rolMatch = filtroRol === "Todos" || user.rol === filtroRol;
      return nameMatch && rolMatch;
    });

    setFilteredUserList(filtered);
  }, [userList, busquedaNombre, filtroRol]);

  useEffect(() => {
    if (userData) {
      setUserName(userData.userName || "");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhone(userData.phone || "");
    }
  }, [userData]);

  const handleToggle = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const updateUserData = async () => {
    setIsSaving(true);
    try {
      const currentUser = auth.currentUser as User;

      const updatedData = {
        userName,
        firstName,
        lastName,
        phone,
        displayName: userName,
        imageFolder: userData?.imageFolder || undefined,
        profilePicture: userData?.profilePicture || "",
      };

      const newPhotoURL = await UserDAO.updateUserProfile(
        currentUser,
        updatedData,
        newProfileImage || undefined,
      );

      toast.success("Datos actualizados correctamente.");
      setPreviewImage(newPhotoURL);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar datos del perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSystemStatus = async () => {
    const newStatus = !systemActive;
    await setDoc(doc(db, "hcc_ai_status", "global_status"), {
      active: newStatus,
    });
    setSystemActive(newStatus);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await UserDAO.updateUserProfile({ uid: userId } as User, {
        rol: newRole,
      });
      toast.success(`Rol actualizado a ${newRole}`);
      fetchFirestoreUsers();
    } catch (error) {
      console.error("Error actualizando rol:", error);
      toast.error("No se pudo actualizar el rol.");
    }
  };

  const handleDailyReminderToggle = async (userId: string) => {
    const newValue = !dailyReminderEnabled;
    setDailyReminderEnabled(newValue);
    try {
      await UserDAO.updateUserProfile({ uid: userId } as User, {
        recepcionRecordatorio: newValue,
      });
      toast.success("Preferencia actualizada");
    } catch (error) {
      console.error("Error actualizando recordatorio:", error);
      toast.error("No se pudo guardar la preferencia");
    }
  };

  const deleteUserFromFirestore = async (userId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await UserDAO.updateUserProfile({ uid: userId } as User, {
        eliminado: true,
      });
      toast.success("Usuario eliminado correctamente.");
      fetchFirestoreUsers();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      toast.error("No se pudo eliminar el usuario.");
    }
  };

  const fetchFirestoreUsers = async () => {
    try {
      const users = await UserDAO.getAll();
      const notDeleted = users.filter((u) => u.eliminado !== true);
      setUserList(notDeleted);
      setFilteredUserList(notDeleted);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      toast.error("No se pudo cargar la lista de usuarios.");
    }
  };

  return {
    uid,
    activeSection,
    setActiveSection,
    expandedItem,
    setExpandedItem,
    theme,
    setTheme,
    previewImage,
    setPreviewImage,
    newProfileImage,
    setNewProfileImage,
    userName,
    setUserName,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    isSaving,
    updateUserData,
    systemActive,
    toggleSystemStatus,
    userList,
    filteredUserList,
    busquedaNombre,
    setBusquedaNombre,
    filtroRol,
    setFiltroRol,
    fetchFirestoreUsers,
    handleRoleChange,
    handleToggle,
    deleteUserFromFirestore,
    dailyReminderEnabled,
    handleDailyReminderToggle,
  };
}
