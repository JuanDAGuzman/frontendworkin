import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        title="Página anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {renderPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        const isCurrentPage = page === pagination.currentPage;
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
              isCurrentPage
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            {page}
          </button>
        );
      })}
      
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        title="Página siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="ml-4 text-sm text-gray-600">
        Página {pagination.currentPage} de {pagination.totalPages} 
        <span className="hidden sm:inline">
          {' '}({pagination.total} empleos total)
        </span>
      </div>
    </div>
  );
};

export default Pagination;