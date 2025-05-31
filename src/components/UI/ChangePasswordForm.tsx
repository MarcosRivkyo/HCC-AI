import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChangePasswordForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userEmail = user.email;
      if (userEmail) {
        try {
          setLoading(true);
          await sendPasswordResetEmail(auth, userEmail);
          setLoading(false);
          setSuccessMessage(t("settings.account.success"));
        } catch (err: any) {
          setLoading(false);
          setError(t("settings.account.error"));
        }
      } else {
        setError(t("settings.account.error_no_user"));
      }
    } else {
      setError(t("settings.account.error_no_auth"));
    }
  };

  return (
    <div className="pl-4">
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <p className="text-black dark:text-white">
        {t("settings.account.change_passwd")}
      </p>
      <button
        onClick={handlePasswordReset}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded-lg mt-4"
      >
        {loading ? t("settings.account.sending") : t("settings.account.send")}
      </button>
    </div>
  );
};

export default ChangePasswordForm;
