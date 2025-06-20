import { useState } from "react";
import { AuthDAO } from "../data/dao/AuthDAO";
import { useTranslation } from "react-i18next";

export const useChangePasswordViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t } = useTranslation("global");

  const handlePasswordReset = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const user = AuthDAO.getCurrentUser();

    if (user) {
      const email = user.email;
      if (email) {
        try {
          await AuthDAO.sendResetEmail(email);
          setSuccessMessage(t("settings.account.success"));
        } catch (err) {
          console.error(err);
          setError(t("settings.account.error"));
        }
      } else {
        setError(t("settings.account.error_no_user"));
      }
    } else {
      setError(t("settings.account.error_no_auth"));
    }

    setLoading(false);
  };

  return {
    loading,
    error,
    successMessage,
    handlePasswordReset,
  };
};
