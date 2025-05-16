import React, { useState } from "react";
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DeleteAccountButton: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState<string>("");
  const { t } = useTranslation("global");
  const navigate = useNavigate();

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
