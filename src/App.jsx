import React, { useState, useEffect, useRef } from "react";

// Importar hooks personalizados
import { useJobs } from "./hooks/useJobs";
import { useDebounce } from "./hooks/useDebounce";
import { useAnimations } from "./hooks/useAnimations";

// Importar componentes
import JobCard from "./components/JobCard";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import Sidebar from "./components/Sidebar";
import JobModal from "./components/JobModal";

const App = () => {
  // Estados principales
  const { jobs, loading, error, pagination, fetchJobs } = useJobs();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchingLocally, setIsSearchingLocally] = useState(false);

  // Refs para animaciones
  const headerRef = useRef(null);
  const { animateIn } = useAnimations();

  // Estado de filtros
  const [filters, setFilters] = useState({
    titulo: "",
    empresa_id: "",
    salario_min: "",
    salario_max: "",
    ordenar_por: "fecha_publicacion",
    orden: "DESC",
  });

  // Debounce para búsqueda optimizada (500ms)
  const debouncedTitulo = useDebounce(filters.titulo, 500);

  // Efecto para animación inicial del header
  useEffect(() => {
    if (headerRef.current) {
      animateIn(headerRef.current, 0);
    }
  }, [animateIn]);

  // Efecto para carga inicial de empleos
  useEffect(() => {
    console.log("🚀 Cargando empleos iniciales...");
    fetchJobs({ page: 1, limit: 10 });
  }, []);

  // Efecto para búsqueda optimizada por título
  useEffect(() => {
    // Indicar que estamos buscando localmente mientras se actualiza
    if (filters.titulo !== debouncedTitulo) {
      setIsSearchingLocally(true);
    }

    const currentFilters = {
      ...filters,
      titulo: debouncedTitulo,
    };

    console.log("🔍 Búsqueda optimizada con título:", debouncedTitulo);
    console.log("📊 Filtros actuales:", currentFilters);

    fetchJobs({ page: 1, limit: 10, ...currentFilters });

    // Limpiar estado de búsqueda local
    setTimeout(() => setIsSearchingLocally(false), 500);
  }, [debouncedTitulo]);

  // Manejadores de eventos
  const handleFilterChange = (field, value) => {
    console.log(`🔧 Cambiando filtro ${field}:`, value);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("🔄 Búsqueda manual completa con filtros:", filters);
    fetchJobs({ page: 1, limit: 10, ...filters });
  };

  const handlePageChange = (newPage) => {
    console.log("📄 Cambiando a página:", newPage);
    fetchJobs({
      page: newPage,
      limit: 10,
      ...filters,
      titulo: debouncedTitulo,
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleViewDetails = (job) => {
    console.log("👁️ Viendo detalles del empleo:", job.titulo);
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleViewJobFromCompany = (newJob) => {
    console.log("🔄 Cambiando a empleo desde modal de empresa:", newJob.titulo);

    // Crear un objeto de empleo compatible con el formato esperado
    const jobWithCompanyInfo = {
      ...newJob,
      // Si no tiene nombre_empresa, intentar obtenerlo del job actual
      nombre_empresa:
        newJob.nombre_empresa ||
        selectedJob?.nombre_empresa ||
        "Empresa no especificada",
    };

    setSelectedJob(jobWithCompanyInfo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedJob(null), 300);
  };

  // Debug: mostrar estado actual
  console.log("🔍 Estado actual:", {
    jobs: jobs?.length || 0,
    loading,
    error,
    pagination,
    filters,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con animación */}
      <header
        ref={headerRef}
        className="bg-white shadow-sm border-b"
        style={{ opacity: 0, transform: "translateY(-20px)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                WorkIn
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              <span className="hidden sm:inline">Total: </span>
              <span className="font-medium text-blue-600">
                {pagination.total || 0}
              </span>
              <span className="hidden sm:inline"> empleos disponibles</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Barra de búsqueda */}
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          showFilters={showFilters}
          onToggleFilters={toggleFilters}
          isSearching={loading || isSearchingLocally}
        />

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de empleos */}
          <div className="lg:col-span-2">
            {/* Estado de carga */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando empleos...</p>
                <p className="text-xs text-blue-500 mt-2">
                  Sistema optimizado trabajando
                </p>
              </div>
            )}

            {/* Estado de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                <div className="flex items-center mb-3">
                  <span className="text-red-500 text-xl mr-2">⚠️</span>
                  <h3 className="text-red-800 font-semibold">
                    Error al cargar empleos
                  </h3>
                </div>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => fetchJobs({ page: 1, limit: 10, ...filters })}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-all duration-200 transform hover:scale-105"
                >
                  🔄 Reintentar
                </button>
              </div>
            )}

            {/* Estado sin resultados */}
            {!loading && !error && (!jobs || jobs.length === 0) && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No encontramos empleos
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.titulo
                    ? `No hay empleos que coincidan con "${filters.titulo}"`
                    : "No se encontraron empleos con los criterios seleccionados."}
                </p>
                <button
                  onClick={() => {
                    const clearedFilters = {
                      titulo: "",
                      empresa_id: "",
                      salario_min: "",
                      salario_max: "",
                      ordenar_por: "fecha_publicacion",
                      orden: "DESC",
                    };
                    setFilters(clearedFilters);
                    fetchJobs({ page: 1, limit: 10, ...clearedFilters });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                >
                  🗑️ Limpiar filtros y recargar
                </button>
              </div>
            )}

            {/* Lista de empleos */}
            {!loading && !error && jobs && jobs.length > 0 && (
              <>
                <div className="space-y-4 mb-6">
                  {jobs.map((job, index) => (
                    <JobCard
                      key={job.id || index}
                      job={job}
                      index={index}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Componente de paginación */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar pagination={pagination} />
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <JobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onViewJob={handleViewJobFromCompany}
      />
    </div>
  );
};

export default App;
