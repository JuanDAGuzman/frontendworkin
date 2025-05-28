import React from 'react';
import { useJobPortal } from './hooks/useJobPortal';
import { 
  JobCard, 
  SearchBar, 
  Pagination, 
  Sidebar, 
  JobModal 
} from './components';
import Navbar from './components/Navbar';

const App = () => {
  const {
    jobs,
    loading,
    error,
    pagination,
    
    selectedJob,
    isModalOpen,
    
    filters,
    showFilters,
    isSearchingLocally,
    
    user,
    userType,
    isAuthenticated,
    authLoading,
    
    openJobModal,
    closeJobModal,
    switchToJob,
    
    handleFilterChange,
    handleSearch,
    toggleFilters,
    clearFilters,
    handlePageChange,
    
    logout,
    simulateLogin,
    
    headerRef
  } = useJobPortal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        userType={userType}
        isAuthenticated={isAuthenticated}
        onLogin={simulateLogin} 
        onLogout={logout}
        totalJobs={pagination.total}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          showFilters={showFilters}
          onToggleFilters={toggleFilters}
          isSearching={loading || isSearchingLocally}
          onClearFilters={clearFilters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando empleos...</p>
                <p className="text-xs text-blue-500 mt-2">Sistema optimizado trabajando</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                <div className="flex items-center mb-3">
                  <span className="text-red-500 text-xl mr-2">⚠️</span>
                  <h3 className="text-red-800 font-semibold">Error al cargar empleos</h3>
                </div>
                <p className="text-red-700 mb-4">{error}</p>
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-all duration-200 transform hover:scale-105"
                >
                  🔄 Reintentar
                </button>
              </div>
            )}

            {!loading && !error && (!jobs || jobs.length === 0) && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No encontramos empleos
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.titulo 
                    ? `No hay empleos que coincidan con "${filters.titulo}"`
                    : "No se encontraron empleos con los criterios seleccionados."
                  }
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                >
                  🗑️ Limpiar filtros y recargar
                </button>
              </div>
            )}

            {!loading && !error && jobs && jobs.length > 0 && (
              <>
                <div className="space-y-4 mb-6">
                  {jobs.map((job, index) => (
                    <JobCard 
                      key={job.id || index} 
                      job={job} 
                      index={index}
                      onViewDetails={openJobModal}
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <Pagination 
                    pagination={pagination} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <Sidebar pagination={pagination} />
          </div>
        </div>
      </div>

      <JobModal 
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeJobModal}
        onViewJob={switchToJob}
      />
    </div>
  );
};

export default App;

