export const usePagination = (fetchJobs, filters, debouncedTitulo) => {
  
  const handlePageChange = (newPage) => {
    console.log('📄 Cambiando a página:', newPage);
    
    const currentFilters = {
      ...filters,
      titulo: debouncedTitulo
    };
    
    fetchJobs({ 
      page: newPage, 
      limit: 10, 
      ...currentFilters 
    });
  };

  return {
    handlePageChange
  };
};

export default usePagination;