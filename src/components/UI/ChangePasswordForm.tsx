import React, { useState } from 'react'; 
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Para redirigir al usuario

const ChangePasswordForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handlePasswordReset = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userEmail = user.email;  // Obtenemos el correo del usuario

      if (userEmail) {
        try {
          setLoading(true);
          // Enviar el correo de recuperación de contraseña
          await sendPasswordResetEmail(auth, userEmail);
          setLoading(false);
          setSuccessMessage('Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.');
        } catch (err: any) {
          setLoading(false);
          setError('Ocurrió un error al enviar el correo de recuperación. Inténtalo nuevamente.');
        }
      } else {
        setError('No hay un correo asociado a este usuario.');
      }
    } else {
      setError('No hay un usuario autenticado.');
    }
  };

  return (
    <div className="pl-4">
      {/* Mostrar mensaje de éxito o error */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <p>Formulario para cambiar la contraseña:</p>
      <button
        onClick={handlePasswordReset}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded-lg mt-4"
      >
        {loading ? 'Enviando...' : 'Enviar recuperación de contraseña'}
      </button>
    </div>
  );
};

export default ChangePasswordForm;
