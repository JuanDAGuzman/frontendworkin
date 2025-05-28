import { useEffect, useRef } from 'react';

export const useAppAnimations = () => {
  const headerRef = useRef(null);

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

  useEffect(() => {
    animateHeader();
  }, []);

  return {
    headerRef
  };
};

export default useAppAnimations;