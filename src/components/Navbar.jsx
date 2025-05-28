import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronDown,
  Building2,
  Shield,
  Briefcase,
  Users
} from 'lucide-react';

const Navbar = ({ 
  user, 
  userType, 
  isAuthenticated, 
  onLogin, 
  onLogout,
  totalJobs = 0 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nueva oferta disponible', time: '5 min', read: false },
    { id: 2, message: 'Mensaje de TechCorp', time: '1 hora', read: false },
  ]);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserIcon = () => {
    switch (userType) {
      case 'empresa':
        return <Building2 className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getUserColor = () => {
    switch (userType) {
      case 'empresa':
        return 'from-purple-500 to-purple-700';
      case 'admin':
        return 'from-red-500 to-red-700';
      default:
        return 'from-blue-500 to-blue-700';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              WorkIn
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Empleos
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Empresas
              </a>
              {userType === 'empresa' && (
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Publicar Empleo
                </a>
              )}
              {userType === 'admin' && (
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Panel Admin
                </a>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <Briefcase className="w-4 h-4 mr-1" />
              <span className="font-medium text-blue-600">{totalJobs}</span>
              <span className="hidden sm:inline ml-1">empleos</span>
            </div>

            {!isAuthenticated && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onLogin('usuario')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => onLogin('usuario')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </button>
                
                <div className="hidden lg:flex items-center space-x-2 ml-4 pl-4 border-l">
                  <span className="text-xs text-gray-500">Demo:</span>
                  <button
                    onClick={() => onLogin('usuario')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    Usuario
                  </button>
                  <button
                    onClick={() => onLogin('empresa')}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                  >
                    Empresa
                  </button>
                  <button
                    onClick={() => onLogin('admin')}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${getUserColor()} rounded-full flex items-center justify-center text-white`}>
                      {getUserIcon()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                      <p className="text-xs text-gray-500 capitalize">{userType}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getUserColor()} rounded-full flex items-center justify-center text-white`}>
                            {getUserIcon()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user?.nombre}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              userType === 'empresa' ? 'bg-purple-100 text-purple-800' :
                              userType === 'admin' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {userType === 'empresa' ? 'Empresa' : 
                               userType === 'admin' ? 'Administrador' : 'Usuario'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <User className="w-4 h-4 mr-3" />
                          Mi Perfil
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <MessageCircle className="w-4 h-4 mr-3" />
                          Mensajes
                          <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </a>
                        {userType === 'usuario' && (
                          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Briefcase className="w-4 h-4 mr-3" />
                            Mis Aplicaciones
                          </a>
                        )}
                        {userType === 'empresa' && (
                          <>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Briefcase className="w-4 h-4 mr-3" />
                              Mis Empleos
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Users className="w-4 h-4 mr-3" />
                              Candidatos
                            </a>
                          </>
                        )}
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Settings className="w-4 h-4 mr-3" />
                          Configuración
                        </a>
                      </div>

                      <div className="border-t border-gray-200 py-2">
                        <button
                          onClick={onLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;