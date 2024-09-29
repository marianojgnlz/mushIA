import React from "react";
import { useNavigate } from "react-router-dom";
import logo from './logo.png';

function Login() {
  const navigate = useNavigate();

  const handleArrowClick = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-[#6C63FF] text-white font-sans">
      <div className="mt-12 text-center">
        <div className="mb-2">
          <img src={logo} alt="logo" className="w-15 h-15 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold">mushIA</h1>
      </div>

      <div className="text-center mb-12" style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)'
      }}>
        <h2 className="text-2xl font-bold mb-2">¡Bienvenido!</h2>
        <p className="text-base mb-5">
          Seré tu asistente personal, te ayudaré a gestionar y optimizar tus finanzas
        </p>
        <div 
          className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex justify-center items-center cursor-pointer mx-auto"
          onClick={handleArrowClick}
        >
          <span className="text-2xl">&rarr;</span>
        </div>
      </div>
    </div>
  );
}

export default Login;