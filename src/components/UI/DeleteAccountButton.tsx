import React, { useState } from 'react'; 
import { getAuth, deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Para redirigir al usuario

const DeleteAccountButton: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');  // El correo del usuario
  const [password, setPassword] = useState<string>('');  // La contraseña del usuario
  const [confirmationText, setConfirmationText] = useState<string>('');  // Texto de confirmación
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Mostrar mensaje de confirmación antes de proceder
      const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.");

      if (isConfirmed) {
        try {
          setLoading(true);
          await deleteUser(user);  // Intentar eliminar la cuenta de Firebase
          setLoading(false);
          alert("Cuenta eliminada con éxito.");
          // Opcional: Redirigir al usuario a la página de inicio
          navigate("/login");  // Redirige al usuario a la página de inicio de sesión
        } catch (err: any) {
          setLoading(false);
          if (err.code === 'auth/requires-recent-login') {
            setError('Se requiere volver a iniciar sesión antes de eliminar la cuenta.');

            // Redirigir al usuario al inicio de sesión para autenticarse de nuevo
            const confirmed = window.confirm('Para eliminar tu cuenta, necesitas iniciar sesión nuevamente.');
            if (confirmed) {
              // Solicitamos el correo y la contraseña del usuario
              const userEmail = prompt('Introduce tu correo:');
              const userPassword = prompt('Introduce tu contraseña:');

              if (userEmail && userPassword) {
                try {
                  await signInWithEmailAndPassword(auth, userEmail, userPassword);  // Iniciar sesión de nuevo
                  await deleteUser(user);  // Intentar eliminar la cuenta después de iniciar sesión
                  alert('Cuenta eliminada con éxito.');
                  navigate("/login");  // Redirigir al usuario a la página de inicio de sesión
                } catch (error) {
                  setError('Error al iniciar sesión nuevamente. Intenta nuevamente.');
                }
              }
            }
          } else {
            setError('Ocurrió un error al eliminar la cuenta. Inténtalo nuevamente.');
          }
        }
      }
    } else {
      setError('No hay un usuario autenticado.');
    }
  };

  return (
    <div>
      {/* Campo para escribir 'borrar' */}
      <div className="mb-4">
        <label className="block text-red-500 mb-2">Escribe <strong>borrar</strong> para confirmar la eliminación:</label>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
      </div>

      {/* Botón de eliminación solo habilitado si se escribe 'borrar' */}
      <button
        onClick={handleDeleteAccount}
        disabled={loading || confirmationText.toLowerCase() !== 'borrar'}
        className="bg-red-500 text-white p-2 rounded-lg w-full"
      >
        {loading ? 'Eliminando...' : 'Eliminar mi cuenta'}
      </button>

      {/* Mostrar error si existe */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Mensaje si no se escribe 'borrar' */}
      {confirmationText && confirmationText.toLowerCase() !== 'borrar' && (
        <p className="text-red-500 mt-2">Por favor, escribe <strong>borrar</strong> para confirmar.</p>
      )}
    </div>
  );
};

export default DeleteAccountButton;
