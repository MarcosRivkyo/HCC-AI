import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ImageSlider from "./ImageSlider";
import logoHCC_AI from "./assets/logo_hcc_ai.jpg";
import logoGoogle from "./assets/logo_google.jpg";


function Signup() {

    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();
    
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const signUpWithEmail = async () => {

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setAuthing(true);
        setError('');

        try {
            // Crear usuario con email y contraseña
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar los datos del usuario en Firestore
            await setDoc(doc(db, 'hcc_ai_users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                jobTitle: jobTitle,
                phone: phone,
                createdAt: serverTimestamp(), // Esto agrega la fecha de creación automáticamente
            });

            console.log('Usuario registrado y datos guardados en Firestore');
            navigate('/');
        } catch (error) {
            console.log(error);
            setError((error as any).message);
            setAuthing(false);
        }
    };

    return (
        <div className='w-full h-screen flex'>
            {/* Parte izquierda */}
            <div className="w-1/2 h-full flex flex-col bg-[#282c34]">
                <ImageSlider />
            </div>

            {/* Right half of the screen - signup form */}
            <div className="w-1/2 h-full bg-black flex flex-col p-20 justify-center">
                <div className="w-full flex flex-col max-w-[450px] mx-auto">
                    <div className='w-full flex flex-col mb-10 text-white' >
                        <img src={logoHCC_AI} alt="Logo HCC-AI" className="w-80 rounded-md center mx-auto mb-10 cursor-pointer" onClick={() => navigate('/') } />
                        <h3 className="text-4xl font-bold mb-2 text-center">Registrarse</h3>
                        <p className="text-lg mb-4 text-center">¡Bienvenido! Introduce tus datos para registrarte.</p>
                    </div>

                    <div className='w-full flex flex-wrap gap-4 mb-6'>
                        <input type='text' placeholder='Nombre' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input type='text' placeholder='Apellido' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <input type='email' placeholder='Email' className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={email} onChange={(e) => setEmail(e.target.value)} />
                    
                    <div className='w-full flex flex-wrap gap-4 mb-6'>
                        <input type='password' placeholder='Password' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type='password' placeholder='Re-Enter Password' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <div className='w-full flex flex-wrap gap-4 mb-6'>
                        <input type='text' placeholder='Puesto' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                        <input type='text' placeholder='Número de Teléfono' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    {/* Display error message if there is one */}
                    {error && <div className='text-red-500 mb-4'>{error}</div>}

                    {/* Button to sign up with email and password */}
                    <div className='w-full flex flex-col mb-4'>
                        <button
                            onClick={signUpWithEmail}
                            disabled={authing}
                            className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
                            Registrarse
                        </button>
                    </div>

                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-500'></div>
                        <p className='text-lg absolute text-gray-500 bg-black px-2'>OR</p>
                    </div>

                    <button
                        disabled={authing}
                        className='w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-7'
                    >
                        <img 
                            src={logoGoogle}
                            alt="Google Logo"
                            className="w-10 h-10 mr-20"
                        />

                        Registrarse con Google
                    </button>
                </div>

                <div className='w-full flex items-center justify-center mt-10'>
                    <p className='text-sm font-normal text-gray-400'>¿Ya tienes cuenta? <span className='font-semibold text-white cursor-pointer underline'><a href='/login'>Inicia Sesión</a></span></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
