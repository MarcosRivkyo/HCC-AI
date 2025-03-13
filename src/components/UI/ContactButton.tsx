import React from 'react';
import { FaPhone } from 'react-icons/fa';

const ContactButton: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <a href="tel:+1234567890" className="bg-blue-500 text-white p-4 rounded-full shadow-lg flex justify-center items-center animate-bounce hover:bg-blue-700">
        <FaPhone size={30} />
      </a>
    </div>
  );
};

export default ContactButton;
