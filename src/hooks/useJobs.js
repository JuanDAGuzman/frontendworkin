import { useState, useCallback } from 'react';
import { jobsAPI } from '../services/jobsApi';

// Hook personalizado para manejar empleos con búsqueda optimizada
export const useJobs = () => {
  const [allJobs, setAllJobs] = useState([]); // Todos los empleos cargados
  const [filteredJobs, setFilteredJobs] = useState([]); // Empleos filtrados localmente
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastServerFilters, setLastServerFilters] = useState({}); // Últimos filtros usados en servidor
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });

  // Función para búsqueda local (solo por título)
  const searchLocally = useCallback((jobs, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return jobs;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return jobs.filter(job => 
      job.titulo && job.titulo.toLowerCase().includes(term)
    );
  }, []);

  // Función para determinar si necesitamos consultar el servidor
  const needsServerQuery = useCallback((newFilters) => {
    const serverFilters = ['salario_min', 'salario_max', 'empresa_id', 'ordenar_por', 'orden'];
    
    // Si algún filtro del servidor cambió, necesitamos consultar
    return serverFilters.some(filter => 
      newFilters[filter] !== lastServerFilters[filter]
    );
  }, [lastServerFilters]);

  const fetchJobs = useCallback(async (params = {}) => {
    const { titulo, ...serverParams } = params;
    
    // Verificar si necesitamos consultar el servidor
    const needsServer = needsServerQuery(serverParams) || allJobs.length === 0;
    
    if (needsServer) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Consultando servidor con:', serverParams);
        const data = await jobsAPI.getJobs(serverParams);
        
        setAllJobs(data.empleos || []);
        setLastServerFilters(serverParams);
        
        // Aplicar filtro de título localmente
        const filtered = searchLocally(data.empleos || [], titulo);
        setFilteredJobs(filtered);
        
        setPagination({
          ...data.pagination,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / (params.limit || 10))
        });
        
      } catch (err) {
        setError(err.message);
        console.error('❌ Error del servidor:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Solo búsqueda local por título
      console.log('🔍 Búsqueda local para:', titulo);
      const filtered = searchLocally(allJobs, titulo);
      setFilteredJobs(filtered);
      
      setPagination(prev => ({
        ...prev,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / (params.limit || 10)),
        currentPage: 1
      }));
    }
  }, [allJobs.length, needsServerQuery, searchLocally]);

  // Función para obtener jobs paginados
  const getPaginatedJobs = useCallback((page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs]);

  // Función para obtener información de empresa (nueva)
  const fetchCompany = useCallback(async (companyId) => {
    try {
      return await jobsAPI.getCompanyById(companyId);
    } catch (error) {
      console.error('❌ Error obteniendo empresa:', error);
      throw error;
    }
  }, []);

  return { 
    jobs: getPaginatedJobs(pagination.currentPage, pagination.limit),
    allJobs: filteredJobs, // Para debugging
    loading, 
    error, 
    pagination, 
    fetchJobs,
    getPaginatedJobs,
    fetchCompany // Nueva función exportada
  };
};

export default useJobs;