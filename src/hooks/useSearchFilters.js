import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

// Hook para manejar filtros de búsqueda
export const useSearchFilters = (fetchJobs) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchingLocally, setIsSearchingLocally] = useState(false);
  
  const [filters, setFilters] = useState({
    titulo: '',
    empresa_id: '',
    salario_min: '',
    salario_max: '',
    ordenar_por: 'fecha_publicacion',
    orden: 'DESC'
  });

  // Debounce para búsqueda optimizada (500ms)
  const debouncedTitulo = useDebounce(filters.titulo, 500);

  // Efecto para búsqueda optimizada por título
  useEffect(() => {
    // Solo ejecutar si hay un título con debounce
    if (debouncedTitulo !== filters.titulo && debouncedTitulo !== undefined) {
      setIsSearchingLocally(true);
    }
    
    // Solo buscar si el debouncedTitulo es diferente al inicial
    if (debouncedTitulo !== undefined) {
      const currentFilters = {
        ...filters,
        titulo: debouncedTitulo
      };
      
      console.log('🔍 Búsqueda optimizada con título:', debouncedTitulo);
      
      fetchJobs({ page: 1, limit: 10, ...currentFilters });
      
      // Limpiar estado de búsqueda local
      setTimeout(() => setIsSearchingLocally(false), 500);
    }
  }, [debouncedTitulo]);

  const handleFilterChange = (field, value) => {
    console.log(`🔧 Cambiando filtro ${field}:`, value);
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log('🔄 Búsqueda manual completa con filtros:', filters);
    fetchJobs({ page: 1, limit: 10, ...filters });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      titulo: '',
      empresa_id: '',
      salario_min: '',
      salario_max: '',
      ordenar_por: 'fecha_publicacion',
      orden: 'DESC'
    };
    setFilters(clearedFilters);
    fetchJobs({ page: 1, limit: 10, ...clearedFilters });
  };

  return {
    filters,
    showFilters,
    isSearchingLocally,
    handleFilterChange,
    handleSearch,
    toggleFilters,
    clearFilters,
    debouncedTitulo
  };
};

export default useSearchFilters;