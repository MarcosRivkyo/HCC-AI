import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MobileWarning: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation("global");

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    if (isMobile) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-yellow-100 text-yellow-900 p-4 text-sm text-center w-full shadow-md">
      {t("warning.pc_optimitation")}
    </div>
  );
};

export default MobileWarning;
