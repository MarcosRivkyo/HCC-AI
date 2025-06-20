import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import logo_user from "../../assets/images/logo_user.png";
import { useTranslation } from "react-i18next";
import { FaUserMd, FaUserTie, FaUserInjured } from "react-icons/fa";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userData?: any;
  user?: any;
};

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  user,
}) => {
  const { t } = useTranslation("global");

  const [profileImage, setProfileImage] = useState<string>(logo_user);

  useEffect(() => {
    if (userData?.profilePicture) {
      setProfileImage(userData.profilePicture);
    } else if (user?.photoURL) {
      setProfileImage(user.photoURL);
    } else {
      setProfileImage(logo_user);
    }
  }, [userData?.profilePicture, user?.photoURL]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case "Médico":
        return <FaUserMd className="text-blue-400 inline-block mr-1" />;
      case "Administrador":
        return <FaUserTie className="text-purple-400 inline-block mr-1" />;
      case "Paciente":
        return <FaUserInjured className="text-green-400 inline-block mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <p className="text-xl font-semibold mb-4 text-white text-center">
        {user?.displayName}
      </p>
      <img
        src={profileImage}
        alt="Perfil"
        className="w-20 h-20 max-w-full rounded-full mx-auto"
      />
      <p className="text-gray-500 text-center">
        {userData?.email || user?.email}
      </p>

      <p className="mt-5 text-gray-400 text-sm">
        <span className="font-medium">{t("roles.fullName")}</span>{" "}
        {userData?.firstName && userData?.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : t("roles.nameUnavailable", "Nombre no disponible")}
      </p>
      <p className="mt-2 text-gray-400 text-sm">
        📅 {t("profile.registeredAt")}:{" "}
        {userData?.createdAt
          ? userData.createdAt.toDate().toLocaleString()
          : "Fecha no disponible"}
      </p>
      <p className="mt-2 text-gray-400 text-sm">
        ☎️ {t("profile.phoneNumber")}:{" "}
        {userData?.phone || "Teléfono no disponible"}
      </p>
      {userData?.rol && (
        <p className="mt-2 text-gray-400 text-sm">
          {getRoleIcon(userData.rol)}
          <span> {t("roles.registeredAs")}</span>
          <span className="italic"> {t(`roles.${userData.rol}`)}</span>
        </p>
      )}
    </Modal>
  );
};

export default ProfileModal;
