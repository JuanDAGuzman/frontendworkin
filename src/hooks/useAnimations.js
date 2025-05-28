import { useState, useCallback } from 'react';


const animate = (from, to, options = {}) => {
  const { duration = 500, onUpdate, onComplete } = options;
  const startTime = Date.now();
  
  const tick = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = from + (to - from) * progress;
    
    if (onUpdate) onUpdate(value);
    
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  requestAnimationFrame(tick);
};

export const useAnimations = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const animateIn = useCallback((element, delay = 0) => {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      animate(0, 1, {
        duration: 600,
        onUpdate: (value) => {
          if (element) {  
            element.style.opacity = value;
            element.style.transform = `translateY(${20 * (1 - value)}px)`;
          }
        }
      });
    }, delay);
  }, []);

  const animateButton = useCallback((element) => {
    if (!element) return;
    
    const originalTransform = element.style.transform;
    animate(1, 1.05, {
      duration: 150,
      onUpdate: (value) => {
        if (element) {
          element.style.transform = `scale(${value})`;
        }
      },
      onComplete: () => {
        animate(1.05, 1, {
          duration: 150,
          onUpdate: (value) => {
            if (element) {
              element.style.transform = `scale(${value})`;
            }
          },
          onComplete: () => {
            if (element) {
              element.style.transform = originalTransform;
            }
          }
        });
      }
    });
  }, []);

  const animateOut = useCallback((element, onComplete) => {
    if (!element) {
      if (onComplete) onComplete();
      return;
    }
    
    animate(1, 0, {
      duration: 300,
      onUpdate: (value) => {
        if (element) {
          element.style.opacity = value;
          element.style.transform = `translateY(${20 * (1 - value)}px)`;
        }
      },
      onComplete
    });
  }, []);

  return { 
    animateIn, 
    animateButton, 
    animateOut,
    isVisible, 
    setIsVisible 
  };
};

export default useAnimations;