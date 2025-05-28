import { useEffect } from 'react';
import { useJobs } from './useJobs';
import { useJobModal } from './useJobModal';
import { useSearchFilters } from './useSearchFilters';
import { useAppAnimations } from './useAppAnimations';
import { usePagination } from './usePagination';

export const useJobPortal = () => {
  const { jobs, loading, error, pagination, fetchJobs } = useJobs();
  
  const { 
    selectedJob, 
    isModalOpen, 
    openJobModal, 
    closeJobModal, 
    switchToJob 
  } = useJobModal();
  
  const {
    filters,
    showFilters,
    isSearchingLocally,
    handleFilterChange,
    handleSearch,
    toggleFilters,
    clearFilters,
    debouncedTitulo
  } = useSearchFilters(fetchJobs);
  
  const { headerRef } = useAppAnimations();
  
  const { handlePageChange } = usePagination(fetchJobs, filters, debouncedTitulo);

  useEffect(() => {
    console.log('🚀 Cargando empleos iniciales...');
    fetchJobs({ page: 1, limit: 10 });
  }, []);

  console.log('🔍 Estado del portal:', {
    jobs: jobs?.length || 0,
    loading,
    error,
    pagination,
    filters
  });

  return {
    jobs,
    loading,
    error,
    pagination,
    
    selectedJob,
    isModalOpen,
    
    filters,
    showFilters,
    isSearchingLocally,
    
    fetchJobs,
    
    openJobModal,
    closeJobModal,
    switchToJob,
    
    handleFilterChange,
    handleSearch,
    toggleFilters,
    clearFilters,
    
    handlePageChange,
    
    headerRef
  };
};

export default useJobPortal;