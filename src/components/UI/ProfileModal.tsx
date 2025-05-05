import React from 'react';
import Modal from "../UI/Modal.tsx";
import logo_user from "../../assets/images/logo_user.png";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userData?: any;
    user?: any;

};

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userData, user }) => {

  if (!userData) {
    return <div>Loading...</div>; // O un mensaje de error si no se recibe userData
  }
  return (
    <Modal open={isOpen} onClose={onClose} size="small">
    <p className="text-xl font-semibold mb-4 text-white text-center">
            {user?.displayName}        
    </p>
    <img src={ user?.photoURL || userData?.profilePicture || logo_user} alt="Perfil" className="w-20 h-20 max-w-full rounded-full mx-auto" />
    <p className="text-gray-500 text-center">{userData?.email || user?.email}</p>
    <p className="mt-2 text-gray-400 text-sm"> {userData?.firstName && userData?.lastName   ? `${userData.firstName} ${userData.lastName}`  : "Nombre no disponible"}</p>
    <p className="mt-2 text-gray-400 text-sm"> 📅 Registrado el: {userData?.createdAt ? userData.createdAt.toDate().toLocaleString() : "Fecha no disponible"}</p>
    <p className="mt-2 text-gray-400 text-sm"> ☎️ Teléfono: {userData?.phone || "Teléfono no disponible"}</p>
    </Modal>



  );
};

export default ProfileModal;
