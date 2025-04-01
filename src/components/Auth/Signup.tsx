import { useState } from 'react';

import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    fetchSignInMethodsForEmail 
} from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { auth, db } from "../../config/firebase"; // Asegúrate de importar Firebase

import ImageSlider from "../UI/ImageSlider";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import logoGoogle from "../../assets/images/logo_google.jpg";


function Signup() {
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();
    
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');

    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [verificationMessage, setVerificationMessage] = useState('');

    const defaultProfilePictureUrl = "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/UI%2FprofileImg%2FdefaultProfileImg.png?alt=media&token=ef91d8f1-771c-4c47-9c3a-aabfbb10bf77";


    const signUpWithEmail = async () => {

        const validCodes = ['HCC2025_CODE_1'];

        if (!validCodes.includes(accessCode.trim())) {
            setError('El código de acceso es inválido.');
            setAuthing(false);
            return;
        }


        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setAuthing(true);
        setError('');
        setVerificationMessage('');

        try {
            // Crear usuario con email y contraseña
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: userName,
                photoURL: defaultProfilePictureUrl,
            });            

            await sendEmailVerification(user);
            const imageFolder = `HCC-AI/users/${user.uid}/images/`;

            // Guardar datos en Firestore
            await setDoc(doc(db, 'hcc_ai_users', user.uid), {
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                jobTitle: jobTitle,
                phone: phone,
                profilePicture: defaultProfilePictureUrl, 
                imageFolder: imageFolder,
                createdAt: serverTimestamp()
            });

            setVerificationMessage('Registro exitoso. Por favor, verifica tu correo electrónico antes de iniciar sesión.');
            
        } catch (error) {
            console.log(error);

            if ((error as any).code === 'auth/email-already-in-use') {
                setError('Esta dirección de correo ya está registrada.');
            } else if ((error as any).code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else {
                setError('Hubo un error en el registro. Inténtalo de nuevo.');
            }
        }

        setAuthing(false);
    };





    return (
        <div className='w-full h-screen flex'>
            {/* Parte izquierda */}
            <div className="w-1/2 h-full flex flex-col bg-[#282c34]">
                <ImageSlider />
            </div>

            {/* Parte derecha - formulario */}
            <div className="w-1/2 h-full bg-black flex flex-col p-20 justify-center">
                <div className="w-full flex flex-col max-w-[450px] mx-auto">
                    <div className='w-full flex flex-col mb-10 text-white'>
                        <img src={logoHCC_AI} alt="Logo HCC-AI" className="w-80 rounded-md center mx-auto mb-10 cursor-pointer" onClick={() => navigate('/') } />
                        <h3 className="text-4xl font-bold mb-2 text-center">Registrarse</h3>
                        <p className="text-lg mb-4 text-center">¡Bienvenido! Introduce tus datos para registrarte.</p>
                    </div>

                    <input type='text' placeholder='Nombre de Usuario' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white mb-4' value={userName} onChange={(e) => setUserName(e.target.value)} />

                    <div className='w-full flex flex-wrap gap-4 mb-6'>
                        <input type='text' placeholder='Nombre' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input type='text' placeholder='Apellidos' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <input type='email' placeholder='Email' className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={email} onChange={(e) => setEmail(e.target.value)} />
                    
                    <div className='w-full flex flex-wrap gap-4 mb-6'>
                        <input type='password' placeholder='Contraseña' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type='password' placeholder='Repetir Contraseña' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <div className='w-full flex flex-wrap gap-4 mb-6'>
                        <input type='text' placeholder='Puesto' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                        <input type='text' placeholder='Número de Teléfono' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    
                    <input type='text' placeholder='Código' className='flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white mb-6' value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />

                    {/* Mostrar errores */}
                    {error && <div className='text-red-500 mb-4'>{error}</div>}
                    
                    {/* Mostrar mensaje de verificación */}
                    {verificationMessage && <div className='text-green-500 mb-4'>{verificationMessage}</div>}

                    {/* Botón de registro */}
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

                </div>

                <div className="w-full flex items-center justify-center mt-10">
                    <p className="text-sm font-normal text-gray-400">
                        ¿Ya tienes cuenta?  
                        <span className="font-semibold text-white cursor-pointer underline">
                            <Link to="/login">Inicia Sesión</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
