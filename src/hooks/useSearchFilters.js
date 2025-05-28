import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

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

  const debouncedTitulo = useDebounce(filters.titulo, 500);

  useEffect(() => {
    if (debouncedTitulo !== filters.titulo && debouncedTitulo !== undefined) {
      setIsSearchingLocally(true);
    }
    
    if (debouncedTitulo !== undefined) {
      const currentFilters = {
        ...filters,
        titulo: debouncedTitulo
      };
      
      console.log('🔍 Búsqueda optimizada con título:', debouncedTitulo);
      
      fetchJobs({ page: 1, limit: 10, ...currentFilters });
      
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