import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logoGoogle from "./assets/logo_google.jpg";
import logoHCC_AI from "./assets/logo_hcc_ai.jpg";
import ImageSlider from "./ImageSlider";
import { Link } from 'react-router-dom';

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Iniciar sesión con Google
    const signInWithGoogle = async () => {
        setAuthing(true);
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(() => navigate("/dashboard"))  // Redirigir tras éxito
            .catch((error) => {
                console.log(error);
                setAuthing(false);
            });
    };

    // Iniciar sesión con email y contraseña
    const signInWithEmail = async () => {
        setAuthing(true);
        setError("");
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigate("/dashboard"))  // Redirigir tras éxito
            .catch((error) => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
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

                    {/* Mensaje de error */}
                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                    {/* Línea divisoria */}
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
                                {/* Usar Link en lugar de un <a> */}
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
