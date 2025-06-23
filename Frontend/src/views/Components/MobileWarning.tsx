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
  <div className="fixed top-[4.5rem] w-full z-[40] bg-yellow-100 text-yellow-900 p-3 text-sm text-center shadow-md">
    {t("warning.pc_optimitation")}
  </div>
);
};

export default MobileWarning;
