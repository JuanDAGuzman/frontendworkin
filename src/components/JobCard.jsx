import React, { useRef, useEffect } from 'react';
import { Building2, MapPin, DollarSign, Clock } from 'lucide-react';
import { formatSalary, formatDate } from '../utils/formatters';

const JobCard = ({ job, index, onViewDetails }) => {
  const cardRef = useRef(null);
  const buttonRef = useRef(null);

  // Animación simple sin hook para evitar loops
  useEffect(() => {
    if (cardRef.current) {
      const element = cardRef.current;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      // Timeout simple para animación
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0px)';
      }, index * 100);
    }
  }, [index]);

  const handleButtonClick = () => {
    // Animación simple del botón
    if (buttonRef.current) {
      const button = buttonRef.current;
      button.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        onViewDetails(job);
      }, 150);
    } else {
      onViewDetails(job);
    }
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 transform hover:-translate-y-1"
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {job.titulo || 'Título no disponible'}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building2 className="w-4 h-4 mr-2" />
            <span>{job.nombre_empresa || 'Empresa no especificada'}</span>
          </div>
          {job.ubicacion && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{job.ubicacion}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center text-green-600 font-semibold mb-2">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{formatSalary(job.salario)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatDate(job.fecha_publicacion)}</span>
          </div>
        </div>
      </div>
      
      {job.descripcion && (
        <p className="text-gray-700 mb-4 line-clamp-3">
          {job.descripcion}
        </p>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {job.tipo_contrato && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {job.tipo_contrato}
            </span>
          )}
          {job.modalidad && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {job.modalidad}
            </span>
          )}
        </div>
        <button 
          ref={buttonRef}
          onClick={handleButtonClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default JobCard;