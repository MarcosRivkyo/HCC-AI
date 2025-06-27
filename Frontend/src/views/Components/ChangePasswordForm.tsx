// src/views/Components/ChangePasswordForm.tsx

import React from "react";
import { useChangePasswordViewModel } from "../../viewmodels/useChangePasswordFormViewModel";
import { useTranslation } from "react-i18next";

const ChangePasswordForm: React.FC = () => {
  const { loading, error, successMessage, handlePasswordReset } =
    useChangePasswordViewModel();
  const { t } = useTranslation("global");

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
