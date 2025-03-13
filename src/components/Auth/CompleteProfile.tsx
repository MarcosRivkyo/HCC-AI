import { FormEvent, useState } from "react";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";


import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";

const CompleteProfile = () => {
  const user = auth.currentUser;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState('');


      
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userRef = doc(db, "hcc_ai_users", user.uid);
      await updateDoc(userRef, {
        firstName,
        lastName,
        jobTitle,
        phone,
      });
      alert("Perfil actualizado correctamente");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error al actualizar perfil", error);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full flex flex-col bg-[#282c34]">
        {/* Puedes agregar un slider de imágenes aquí si lo deseas */}
      </div>

      {/* Parte derecha - formulario */}
      <div className="w-1/2 h-full bg-black flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          <div className="w-full flex flex-col mb-10 text-white">

            <div className='w-full flex flex-col mb-10 text-white'>
                        <img src={logoHCC_AI} alt="Logo HCC-AI" className="w-80 rounded-md center mx-auto mb-10"/>
                        <h3 className="text-4xl font-bold mb-2 text-center">Completa tu perfil</h3>
                        <p className="text-lg mb-4 text-center">
                        ¡Bienvenido! Por favor, completa tu perfil.
                        </p>
            </div>

          </div>

          {/* Campos de formulario */}
          <div className="w-full flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Nombre"
              className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellidos"
              className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Puesto"
              className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Botón de guardar */}
          <div className="w-full flex flex-col mb-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
