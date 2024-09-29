import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTarget, FiEdit, FiCamera, FiRefreshCw, FiChevronRight, FiMessageSquare, FiUser } from 'react-icons/fi';
import { FaChartPie } from "react-icons/fa";
import logo from './logo.png'; // Make sure this path is correct

const HomePage = () => {
  const navigate = useNavigate();

  const configItems = [
    "Contraseña", "Datos personales", "Notificaciones", "Ingresos y Gastos",
    "Moneda principal y secundaria", "Suscripción premium", "Respaldo", "Personalización", "Ayuda"
  ];

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-[#8378FF]">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 overflow-y-auto">
        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: <FiTarget />, text: "Defini tus objetivos de ahorro" },
            { icon: <FiEdit />, text: "Personalizá tu perfil financiero" },
            { icon: <FiCamera />, text: "Escanea tu ticket" },
            { icon: <FiRefreshCw />, text: "Sincronizar gastos" },
          ].map((item, index) => (
            <button key={index} className="bg-purple-100 p-4 rounded-lg flex flex-col items-center justify-center text-purple-800">
              <span className="text-2xl mb-2">{item.icon}</span>
              <span className="text-sm text-center">{item.text}</span>
            </button>
          ))}
        </div>

        {/* Configuration section */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-bold mb-4">Configuración</h2>
          {configItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
              <span>{item}</span>
              <FiChevronRight />
            </div>
          ))}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-[#8378FF] flex items-center justify-around safe-area-bottom">
            <button className="text-white py-4"><FaChartPie /></button>
            <button className="text-white py-4" onClick={handleChatClick}><FiMessageSquare /></button>
            <button className="text-white py-4"><FiUser /></button>
      </nav>
    </div>
  );
};

export default HomePage;
