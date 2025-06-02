import React, { useState } from "react";
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { getFirestore, doc, deleteDoc, getDocs, collection, query, where } from "firebase/firestore";

const DeleteAccountButton: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState<string>("");
  const { t } = useTranslation("global");
  const navigate = useNavigate();



  const deleteAllUserFiles = async (path: string) => {
    const storage = getStorage();
    const dirRef = ref(storage, path);

    const listResult = await listAll(dirRef);


    const deleteFilePromises = listResult.items.map((itemRef) =>
      deleteObject(itemRef)
    );


    const deleteFolderPromises = listResult.prefixes.map((folderRef) =>
      deleteAllUserFiles(folderRef.fullPath)
    );

    await Promise.all([...deleteFilePromises, ...deleteFolderPromises]);
  };


  const deleteUserStudiesAndPredictions = async (userId: string) => {
    const db = getFirestore();


    const studiesRef = collection(db, "hcc_ai_studies");
    const q = query(studiesRef, where("doctorId", "==", userId));
    const studiesSnapshot = await getDocs(q);

    for (const docSnap of studiesSnapshot.docs) {
      const studyId = docSnap.id;
      const predictionId = docSnap.data().predictionId;


      if (predictionId) {
        try {
          await deleteDoc(doc(db, "hcc_ai_predictions", predictionId));
        } catch (e) {
          console.warn("Error eliminando predicción:", e);
        }
      }

      try {
        await deleteDoc(doc(db, "hcc_ai_studies", studyId));
      } catch (e) {
        console.warn("Error eliminando estudio:", e);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const isConfirmed = window.confirm(
        t("settings.account.delete_acount_warning"),
      );

      if (isConfirmed) {
        try {
          setLoading(true);
          
          const db = getFirestore();
          const storage = getStorage();
          const userRef = ref(storage, `HCC-AI/users/${user.uid}`);


          // 1. Borrar archivos de Storage
          await deleteAllUserFiles(`HCC-AI/users/${user.uid}`);

          // 2. Borrar estudios y predicciones del usuario
          await deleteUserStudiesAndPredictions(user.uid);

          // 3. Borrar documento del usuario
          await deleteDoc(doc(db, "hcc_ai_users", user.uid));

          // 4. Borrar el usuario autenticado
          await deleteUser(user);

          setLoading(false);
          alert(t("settings.account.delete_success"));
          navigate("/login");

        } catch (err: any) {
          setLoading(false);
          if (err.code === "auth/requires-recent-login") {
            setError(t("settings.account.reauth_required"));

            const confirmed = window.confirm(
              t("settings.account.reauth_prompt"),
            );
            if (confirmed) {
              const userEmail = prompt(t("settings.account.prompt_email"));
              const userPassword = prompt(
                t("settings.account.prompt_password"),
              );

              if (userEmail && userPassword) {
                try {
                  await signInWithEmailAndPassword(
                    auth,
                    userEmail,
                    userPassword,
                  );
                  await deleteUser(auth.currentUser!);
                  alert(t("settings.account.delete_success"));
                  navigate("/login");
                } catch (error) {
                  setError(t("settings.account.reauth_error"));
                }
              }
            }
          } else {
            setError(t("settings.account.delete_error"));
          }
        }
      }
    } else {
      setError(t("settings.account.error_no_auth"));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-red-500 mb-2">
          {t("settings.account.confirm_label")}{" "}
          <strong>{t("settings.account.confirm_word")}</strong>
        </label>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
      </div>

      <button
        onClick={handleDeleteAccount}
        disabled={
          loading ||
          confirmationText.toLowerCase() !==
            t("settings.account.confirm_word").toLowerCase()
        }
        className="bg-red-500 text-white p-2 rounded-lg w-full"
      >
        {loading
          ? t("settings.account.deleting")
          : t("settings.account.delete_account")}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {confirmationText &&
        confirmationText.toLowerCase() !==
          t("settings.account.confirm_word").toLowerCase() && (
          <p className="text-red-500 mt-2">
            {t("settings.account.confirm_error")}{" "}
            <strong>{t("settings.account.confirm_word")}</strong>.
          </p>
        )}
    </div>
  );
};

export default DeleteAccountButton;
