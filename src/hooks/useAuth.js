import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyToken = async (bearerToken) => {
    try {
      console.log('🔐 Verificando token:', bearerToken);
      
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('❌ Error verificando token:', error);
      throw error;
    }
  };

  const login = async (bearerToken) => {
    try {
      setLoading(true);
      
      const userData = await verifyToken(bearerToken);
      
      localStorage.setItem('authToken', bearerToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setToken(bearerToken);
      setUser(userData.user || userData);
      setUserType(userData.userType || userData.tipo_usuario || 'usuario');
      setIsAuthenticated(true);
      
      console.log('✅ Login exitoso:', userData);
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      logout(); 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión');
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setToken(null);
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem('authToken');
        const savedUserData = localStorage.getItem('userData');
        
        if (savedToken && savedUserData) {
          const userData = JSON.parse(savedUserData);
          
          setToken(savedToken);
          setUser(userData.user || userData);
          setUserType(userData.userType || userData.tipo_usuario || 'usuario');
          setIsAuthenticated(true);
          
          console.log('🔄 Sesión restaurada:', userData);
        }
      } catch (error) {
        console.error('❌ Error restaurando sesión:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const getAuthHeaders = () => {
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
  };

  const simulateLogin = (mockUserType = 'usuario') => {
    const mockUser = {
      id: 1,
      nombre: mockUserType === 'empresa' ? 'TechCorp S.A.S' : 'Juan Pérez',
      email: mockUserType === 'empresa' ? 'contacto@techcorp.com' : 'juan.perez@email.com',
      avatar: null,
      tipo_usuario: mockUserType
    };

    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('userData', JSON.stringify({
      user: mockUser,
      userType: mockUserType
    }));
    
    setToken(mockToken);
    setUser(mockUser);
    setUserType(mockUserType);
    setIsAuthenticated(true);
    
    console.log('🧪 Login simulado:', mockUser);
  };

  return {
    user,
    token,
    userType,
    loading,
    isAuthenticated,
    
    login,
    logout,
    verifyToken,
    getAuthHeaders,
    simulateLogin, // Solo para testing
  };
};

export default useAuth;