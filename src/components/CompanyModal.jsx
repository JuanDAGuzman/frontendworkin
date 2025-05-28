import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, Calendar, Star, Briefcase } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const fetchCompanyData = async (companyId) => {
  try {
    const API_BASE_URL = 'http://localhost:5000/api';
    const url = `${API_BASE_URL}/companies/${companyId}`;
    
    console.log('🌐 Fetching company data from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error text:', errorText);
      
      if (response.status === 404) {
        throw new Error('Empresa no encontrada');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Company data received:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error en Company API:', error);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
};

const CompanyModal = ({ companyId, isOpen, onClose, companyName, onViewJob }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  const animateIn = (element, delay = 0) => {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.4s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0px)';
    }, delay);
  };

  useEffect(() => {
    if (isOpen && companyId) {
      loadCompanyData();
    }
  }, [isOpen, companyId]);

  const loadCompanyData = async () => {
    if (!companyId) {
      console.error('❌ No companyId provided');
      setError('ID de empresa no proporcionado');
      return;
    }
    
    console.log('🏢 Loading company data for ID:', companyId);
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchCompanyData(companyId);
      console.log('✅ Company data loaded successfully:', data);
      setCompany(data);
    } catch (err) {
      console.error('❌ Error loading company:', err);
      setError(err.message || 'Error desconocido al cargar empresa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      animateIn(backdropRef.current, 0);
      animateIn(modalRef.current, 100);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setCompany(null);
    onClose();
  };

  const handleViewJob = async (job) => {
    console.log('👁️ Viewing job from company modal:', job);
    console.log('🔍 Job data from company modal (partial):', job);
    
    const currentModal = modalRef.current;
    if (currentModal) {
      currentModal.style.transition = 'all 0.3s ease-out';
      currentModal.style.transform = 'scale(0.95)';
      currentModal.style.opacity = '0.7';
    }
    
    try {
      console.log('🔄 Trying to fetch complete job data for job ID:', job.id);
      
      const API_BASE_URL = 'http://localhost:5000/api';
      
      let completeJob = null;
      
      try {
        const jobResponse = await fetch(`${API_BASE_URL}/jobs/${job.id}`);
        if (jobResponse.ok) {
          completeJob = await jobResponse.json();
          console.log('✅ Complete job data from /jobs/:id:', completeJob);
        }
      } catch (jobError) {
        console.log('⚠️ /jobs/:id endpoint not available, trying fallback');
      }
      
      if (!completeJob) {
        console.log('🔄 Using fallback: searching in jobs list');
        
        const response = await fetch(`${API_BASE_URL}/jobs?page=1&limit=100`);
        
        if (response.ok) {
          const data = await response.json();
          completeJob = data.empleos?.find(j => j.id === job.id);
          
          if (completeJob) {
            console.log('✅ Complete job data found in list:', completeJob);
          }
        }
      }
      
      const jobToShow = completeJob || {
        ...job,
        nombre_empresa: companyName,
        salario: job.salario || null,
        requisitos: job.requisitos || null, 
      };
      
      console.log('📄 Final job data to show:', jobToShow);
      
      setTimeout(() => {
        handleClose();
        
        if (onViewJob) {
          onViewJob(jobToShow);
        }
      }, 300);
      
    } catch (error) {
      console.error('❌ Error fetching complete job data:', error);
      
      const fallbackJob = {
        ...job,
        nombre_empresa: companyName,
      };
      
      setTimeout(() => {
        handleClose();
        
        if (onViewJob) {
          onViewJob(fallbackJob);
        }
      }, 300);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      style={{ opacity: 0 }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ opacity: 0, transform: 'translateY(20px)' }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {companyName || 'Información de la empresa'}
                </h2>
                <p className="text-sm text-gray-500">Detalles y empleos disponibles</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Cargando información de la empresa...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadCompanyData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && company && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-700">Nombre</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">{company.nombre}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-700">Fundada</span>
                  </div>
                  <p className="text-lg font-semibold text-green-900">
                    {formatDate(company.fecha_creacion)}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <Star className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-700">Calificación</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-yellow-900 mr-2">
                      {company.calificacion || 'N/A'}
                    </span>
                    {company.calificacion && (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(company.calificacion) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Briefcase className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Empleos Disponibles ({company.empleos?.length || 0})
                  </h3>
                </div>

                {company.empleos && company.empleos.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {company.empleos.map((job) => (
                      <div 
                        key={job.id} 
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {job.titulo}
                            </h4>
                            {job.descripcion && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {job.descripcion}
                              </p>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>Publicado {formatDate(job.fecha_publicacion)}</span>
                            </div>
                          </div>
                          <button 
                            className="ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95"
                            onClick={() => handleViewJob(job)}
                            title="Ver detalles completos de este empleo"
                          >
                            📄 Ver empleo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Esta empresa no tiene empleos disponibles actualmente</p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Estadísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {company.empleos?.length || 0}
                    </div>
                    <div className="text-sm text-blue-600">Empleos Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {company.calificacion ? Number(company.calificacion).toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-sm text-blue-600">Calificación</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {new Date().getFullYear() - new Date(company.fecha_creacion).getFullYear()}
                    </div>
                    <div className="text-sm text-blue-600">Años Activa</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {company.id}
                    </div>
                    <div className="text-sm text-blue-600">ID Empresa</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;