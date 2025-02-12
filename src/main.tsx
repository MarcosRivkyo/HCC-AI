import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import Signup from './Signup.tsx'
import AuthRoute from './AuthRoute.tsx'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'  
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDOJoSj4BPVEORJDgIN5H-TJN9JvXQdEnA",
  authDomain: "hcc-ai.firebaseapp.com",
  projectId: "hcc-ai",
  storageBucket: "hcc-ai.firebasestorage.app",
  messagingSenderId: "822292218390",
  appId: "1:822292218390:web:5dffe0efc7b45a382a6b37"
};


initializeApp(firebaseConfig);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute><App /></AuthRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
