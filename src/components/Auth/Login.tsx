import { useState } from "react";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { auth } from "../../config/firebase"; // Asegúrate de importar Firebase
import ImageSlider from "../UI/ImageSlider";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import { FirebaseError } from "firebase/app"; // Importar el tipo de error de Firebase
import { signOut } from "firebase/auth"; // Asegúrate de importar signOut

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showResetInput, setShowResetInput] = useState(false);

    // Iniciar sesión con email y contraseña

    const signInWithEmail = async () => { 
        setAuthing(true);
        setError("");  // Limpiar cualquier error anterior
    
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                
                // Mostrar los datos del usuario en la consola
                console.log("Usuario validado?:", user);
    
                if (user.emailVerified === true) {
                    navigate("/dashboard"); // Redirigir si está verificado
                } else {
                    
                    
                    // Cerrar sesión si el correo no está verificado
                    await signOut(auth);
                    setError("Debes verificar tu correo antes de acceder.");
                }
                setAuthing(false);
            })
            .catch((error) => {
                console.log("Error en la autenticación:", error);
                
                if (error.code === "auth/invalid-credential") {
                    setError("Los datos introducidos no fueron correctos.");
                } else {
                    setError(error.message); 
                }
                setAuthing(false);
            });
    };
    
    

    
    const handlePasswordReset = async () => {
        if (!resetEmail) {
            setError("Por favor, introduce tu email para restablecer la contraseña.");
            return;
        }
    
        try {
            // Intentar enviar el correo de restablecimiento
            await sendPasswordResetEmail(auth, resetEmail);
            setSuccessMessage("Se ha enviado un correo para restablecer tu contraseña.");
        } catch (error) {
            // Hacer un type assertion para decir que error es un FirebaseError
            if ((error as FirebaseError).code === "auth/user-not-found") {
                setError("No hay una cuenta registrada con ese correo.");
            } else {
                setError((error as FirebaseError).message);
            }
        }
    };
    

    return (
        <div className="w-full h-screen flex">
            {/* Parte izquierda */}
            <div className="w-1/2 h-full flex flex-col bg-[#282c34]">
                <ImageSlider />
            </div>

            {/* Parte derecha */}
            <div className="w-1/2 h-full bg-black flex flex-col p-20 justify-center">
                <div className="w-full flex flex-col max-w-[450px] mx-auto">
                    {/* Header */}
                    <div className="w-full flex flex-col mb-10 text-white">
                        <img src={logoHCC_AI} alt="Logo HCC-AI" className="w-80 rounded-md center mx-auto mb-10 cursor-pointer" onClick={() => navigate('/') } />
                        <h3 className="text-4xl font-bold mb-2 text-center">Iniciar Sesión</h3>
                        <p className="text-lg mb-4 text-center">¡Hola de nuevo! Introduce tus datos para entrar.</p>
                    </div>

                    {/* Campos de entrada */}
                    <div className="w-full flex flex-col mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Botón para iniciar sesión */}
                    <div className="w-full flex flex-col mb-4">
                        <button
                            className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                            onClick={signInWithEmail}
                            disabled={authing}
                        >
                            Iniciar Sesión
                        </button>
                    </div>

                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                    {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}

                    {/* Botón para mostrar el input de recuperación de contraseña o el campo de correo para recuperación */}
                    {!showResetInput ? (
                        <div className="text-center">
                            <button onClick={() => setShowResetInput(true)} className="text-gray-400 text-sm underline">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col mb-6">
                            <input
                                type="email"
                                placeholder="Introduce tu correo para restablecer la contraseña"
                                className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <div className="w-full flex flex-col mb-4">
                                <button
                                    onClick={handlePasswordReset}
                                    className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                                >
                                    Enviar correo de recuperación
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <button onClick={() => setShowResetInput(false)} className="text-gray-400 text-sm underline">
                                    Cancelar recuperación
                                </button>
                            </div>
                        </div>
                    )}
                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-500'></div>
                        <p className='text-lg absolute text-gray-500 bg-black px-2'>OR</p>
                    </div>
                    {/* Enlace para registrarse */}
                    <div className="w-full flex items-center justify-center mt-10">
                        <p className="text-sm font-normal text-gray-400">
                            ¿No tienes cuenta? 
                            <span className="font-semibold text-white cursor-pointer underline">
                                <Link to="/signup"> Regístrate</Link>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
