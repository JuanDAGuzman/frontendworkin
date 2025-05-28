import React, { useRef } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAnimations } from '../hooks/useAnimations';

const SearchBar = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  showFilters, 
  onToggleFilters, 
  isSearching = false,
  onClearFilters 
}) => {
  const searchButtonRef = useRef(null);
  const filterButtonRef = useRef(null);
  const { animateButton } = useAnimations();

  const handleSearchClick = () => {
    if (searchButtonRef.current) {
      animateButton(searchButtonRef.current);
    }
    setTimeout(onSearch, 150);
  };

  const handleFilterToggle = () => {
    if (filterButtonRef.current) {
      animateButton(filterButtonRef.current);
    }
    setTimeout(onToggleFilters, 150);
  };

  const handleClearFilters = () => {
    onFilterChange('titulo', '');
    onFilterChange('empresa_id', '');
    onFilterChange('salario_min', '');
    onFilterChange('salario_max', '');
    onFilterChange('ordenar_por', 'fecha_publicacion');
    onFilterChange('orden', 'DESC');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}
              <input
                type="text"
                placeholder="Buscar por título del empleo... (búsqueda automática)"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-lg"
                value={filters.titulo}
                onChange={(e) => onFilterChange('titulo', e.target.value)}
              />
            </div>
            {filters.titulo && (
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-blue-600 flex items-center animate-bounce">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                  Filtrando por: "{filters.titulo}"
                </p>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  🚀 Búsqueda optimizada
                </span>
              </div>
            )}
          </div>
          
          <button
            ref={filterButtonRef}
            type="button"
            onClick={handleFilterToggle}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95"
          >
            <Filter className="w-5 h-5" />
            Filtros {showFilters ? '▲' : '▼'}
          </button>
          
          <button
            ref={searchButtonRef}
            onClick={handleSearchClick}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Aplicar Filtros
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salario mínimo
              </label>
              <input
                type="number"
                placeholder="Ej: 1000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={filters.salario_min}
                onChange={(e) => onFilterChange('salario_min', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salario máximo
              </label>
              <input
                type="number"
                placeholder="Ej: 5000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={filters.salario_max}
                onChange={(e) => onFilterChange('salario_max', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={filters.ordenar_por}
                onChange={(e) => onFilterChange('ordenar_por', e.target.value)}
              >
                <option value="fecha_publicacion">Fecha de publicación</option>
                <option value="salario">Salario</option>
                <option value="titulo">Título</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={filters.orden}
                onChange={(e) => onFilterChange('orden', e.target.value)}
              >
                <option value="DESC">Descendente</option>
                <option value="ASC">Ascendente</option>
              </select>
            </div>
            
            <div className="md:col-span-2 lg:col-span-4 pt-2">
              <button
                onClick={onClearFilters || handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                🗑️ Limpiar todos los filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;