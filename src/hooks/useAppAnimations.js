import { useEffect, useRef } from 'react';

// Hook para manejar animaciones de la aplicación principal
export const useAppAnimations = () => {
  const headerRef = useRef(null);

  // Animación simple de entrada para header
  const animateHeader = () => {
    if (headerRef.current) {
      const element = headerRef.current;
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0px)';
      }, 100);
    }
  };

  // Ejecutar animación de header al montar
  useEffect(() => {
    animateHeader();
  }, []);

  return {
    headerRef
  };
};

export default useAppAnimations;