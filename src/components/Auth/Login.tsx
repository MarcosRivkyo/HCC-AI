import { useState } from "react";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    sendEmailVerification, 
    sendPasswordResetEmail 
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logoGoogle from "../../assets/logo_google.jpg";
import logoHCC_AI from "../../assets/logo_hcc_ai.jpg";
import ImageSlider from "../UI/ImageSlider";
import { Link } from 'react-router-dom';

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Iniciar sesión con Google
    const signInWithGoogle = async () => {
        setAuthing(true);
        signInWithPopup(auth, new GoogleAuthProvider())
            .then((result) => {
                if (result.user.emailVerified) {
                    navigate("/dashboard"); // Redirigir si está verificado
                } else {
                    setError("Debes verificar tu correo antes de acceder.");
                }
                setAuthing(false);
            })
            .catch((error) => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    // Iniciar sesión con email y contraseña
    const signInWithEmail = async () => {
        setAuthing(true);
        setError("");

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user.emailVerified) {
                    navigate("/dashboard"); // Redirigir si está verificado
                } else {
                    setError("Debes verificar tu correo antes de acceder.");
                }
                setAuthing(false);
            })
            .catch((error) => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    // Enviar correo de verificación
    const sendVerificationEmail = async () => {
        const user = auth.currentUser;
        if (user) {
            sendEmailVerification(user)
                .then(() => {
                    setSuccessMessage("Correo de verificación enviado. Revisa tu bandeja de entrada.");
                })
                .catch((error) => {
                    console.log(error);
                    setError(error.message);
                });
        } else {
            setError("Inicia sesión primero para enviar la verificación.");
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError("Por favor, introduce tu email para restablecer la contraseña.");
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => setSuccessMessage("Se ha enviado un correo para restablecer tu contraseña."))
            .catch((error) => setError(error.message));
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

                    <div className="text-center">
                        <button onClick={handlePasswordReset} className="text-gray-400 text-sm underline">¿Olvidaste tu contraseña?</button>
                    </div>
                    
                    {/* Si el usuario no está verificado, permitir reenviar email de verificación */}
                    {error === "Debes verificar tu correo antes de acceder." && (
                        <div className="text-center mt-4">
                            <button onClick={sendVerificationEmail} className="text-blue-400 text-sm underline">Reenviar correo de verificación</button>
                        </div>
                    )}

                    <div className="w-full flex items-center justify-center relative py-4">
                        <div className="w-full h-[1px] bg-gray-500"></div>
                        <p className="text-lg absolute text-gray-500 bg-black px-2">O</p>
                    </div>

                    {/* Botón para iniciar sesión con Google */}
                    <button
                        className="w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-7"
                        onClick={signInWithGoogle}
                        disabled={authing}
                    >
                        <img 
                            src={logoGoogle}
                            alt="Google Logo"
                            className="w-10 h-10 mr-20"
                        />
                        Iniciar Sesión con Google
                    </button>

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
