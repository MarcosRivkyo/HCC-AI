import { useDeleteAccountViewModel } from "../../viewmodels/useDeleteAccountViewModel";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const DeleteAccountButton: React.FC = () => {
  const {
    loading,
    error,
    setError,
    handleDeleteAccount,
    reauthenticateAndDelete,
  } = useDeleteAccountViewModel();

  const [confirmationText, setConfirmationText] = useState<string>("");
  const { t } = useTranslation("global");
  const navigate = useNavigate();


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
