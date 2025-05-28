import React from 'react';
import { TrendingUp, Clock, Search, Filter } from 'lucide-react';

const Sidebar = ({ pagination }) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total de empleos:</span>
            <span className="font-medium text-blue-600">{pagination.total || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Página actual:</span>
            <span className="font-medium">{pagination.currentPage || 1}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total de páginas:</span>
            <span className="font-medium">{pagination.totalPages || 1}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Por página:</span>
            <span className="font-medium">{pagination.limit || 10}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;