// src/viewmodels/useDeleteAccountViewModel.ts

import { useState } from "react";
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserDAO } from "../data/dao/UserDAO";
import { StudyDAO } from "../data/dao/StudyDAO";

export function useDeleteAccountViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const deleteAllUserFiles = async (path: string) => {
    const storage = getStorage();
    const dirRef = ref(storage, path);
    const listResult = await listAll(dirRef);

    const deleteFilePromises = listResult.items.map((itemRef) => deleteObject(itemRef));
    const deleteFolderPromises = listResult.prefixes.map((folderRef) =>
      deleteAllUserFiles(folderRef.fullPath),
    );

    await Promise.all([...deleteFilePromises, ...deleteFolderPromises]);
  };


  
  const deleteUserStudiesAndPredictions = async (userId: string) => {
    const studies = await StudyDAO.getDoctorStudies(userId);
    for (const study of studies) {
      try {
        await StudyDAO.deleteStudyWithPrediction(study.id);
      } catch (e) {
        console.warn("Error eliminando estudio o predicción:", e);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError(t("settings.account.error_no_auth"));
      return;
    }

    const isConfirmed = window.confirm(t("settings.account.delete_acount_warning"));
    if (!isConfirmed) return;

    try {
      setLoading(true);

      // 1. Borrar archivos de Storage
      await deleteAllUserFiles(`HCC-AI/users/${user.uid}`);

      // 2. Borrar estudios y predicciones
      await deleteUserStudiesAndPredictions(user.uid);

      // 3. Borrar datos del usuario en Firestore
      await UserDAO.deleteUser(user.uid);

      // 4. Borrar autenticación
      await deleteUser(user);

      alert(t("settings.account.delete_success"));
      navigate("/login");
    } catch (err: any) {
      setLoading(false);

      if (err.code === "auth/requires-recent-login") {
        setError(t("settings.account.reauth_required"));

        const confirmed = window.confirm(t("settings.account.reauth_prompt"));
        if (confirmed) {
          const userEmail = prompt(t("settings.account.prompt_email"));
          const userPassword = prompt(t("settings.account.prompt_password"));

          if (userEmail && userPassword) {
            try {
              await signInWithEmailAndPassword(auth, userEmail, userPassword);
              await deleteUser(auth.currentUser!);
              alert(t("settings.account.delete_success"));
              navigate("/login");
            } catch (reauthErr) {
              setError(t("settings.account.reauth_error"));
            }
          }
        }
      } else {
        setError(t("settings.account.delete_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const reauthenticateAndDelete = async (email: string, password: string) => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await deleteUser(auth.currentUser!);
      alert(t("settings.account.delete_success"));
      navigate("/login");
    } catch (error) {
      setError(t("settings.account.reauth_error"));
    }
  };

  return {
    loading,
    error,
    setError,
    handleDeleteAccount,
    reauthenticateAndDelete,
  };
}
