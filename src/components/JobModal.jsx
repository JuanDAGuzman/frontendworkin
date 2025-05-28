import React, { useRef, useEffect, useState } from "react";
import {
  X,
  Calendar,
  User,
  FileText,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
} from "lucide-react";
import { useAnimations } from "../hooks/useAnimations";
import { formatSalary, formatDate } from "../utils/formatters";
import CompanyModal from "./CompanyModal";

const JobModal = ({ job, isOpen, onClose, onViewJob }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const { animateIn, animateOut } = useAnimations();

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      backdropRef.current.style.opacity = "0";
      animateIn(backdropRef.current, 0);

      modalRef.current.style.opacity = "0";
      modalRef.current.style.transform = "scale(0.9) translateY(-20px)";

      setTimeout(() => {
        animateIn(modalRef.current, 100);
      }, 100);

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, animateIn]);

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      animateOut(modalRef.current, () => {
        animateOut(backdropRef.current, onClose);
      });
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const handleViewCompany = () => {
    console.log("🏢 Job data:", job);
    console.log("🏢 Company ID:", job?.empresa_id);
    console.log("🏢 Company name:", job?.nombre_empresa);

    if (job?.empresa_id) {
      console.log("🏢 Abriendo modal de empresa:", job.empresa_id);
      setIsCompanyModalOpen(true);
    } else {
      console.error("❌ No hay empresa_id en el job:", job);
      alert(
        "No se pudo obtener la información de la empresa. Falta el ID de empresa."
      );
    }
  };

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false);
  };

  const handleViewJobFromCompany = (selectedJob) => {
    console.log("🔄 Switching from company modal to job modal:", selectedJob);

    setIsCompanyModalOpen(false);

    setTimeout(() => {
      if (onViewJob) {
        onViewJob(selectedJob);
      }
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl z-10">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h2
                  id="modal-title"
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  {job?.titulo || "Título no disponible"}
                </h2>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-5 h-5 mr-2" />
                  <button
                    onClick={handleViewCompany}
                    className="font-medium hover:text-blue-600 transition-colors underline"
                    disabled={!job?.empresa_id}
                  >
                    {job?.nombre_empresa || "Empresa no especificada"}
                  </button>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Contenido del modal */}
          <div className="p-6 space-y-8">
            {/* Información principal en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-4">
                {/* Salario */}
                <div className="flex items-center text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                  <DollarSign className="w-6 h-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-700 font-medium">
                      Salario
                    </p>
                    <p className="text-xl font-bold">
                      {formatSalary(job?.salario)}
                    </p>
                  </div>
                </div>

                {/* Ubicación */}
                {job?.ubicacion && (
                  <div className="flex items-center text-blue-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <MapPin className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Ubicación
                      </p>
                      <p className="font-semibold">{job.ubicacion}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna derecha */}
              <div className="space-y-4">
                {/* Fecha de publicación */}
                <div className="flex items-center text-purple-600 bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <Calendar className="w-6 h-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-purple-700 font-medium">
                      Fecha de publicación
                    </p>
                    <p className="font-semibold">
                      {formatDate(job?.fecha_publicacion)}
                    </p>
                  </div>
                </div>

                {/* Tipo de contrato */}
                {job?.tipo_contrato && (
                  <div className="flex items-center text-orange-600 bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <Briefcase className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-orange-700 font-medium">
                        Tipo de contrato
                      </p>
                      <p className="font-semibold">{job.tipo_contrato}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Badges informativos */}
            <div className="flex flex-wrap gap-3">
              {job?.tipo_contrato && (
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                  📄 {job.tipo_contrato}
                </span>
              )}
              {job?.modalidad && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                  🏠 {job.modalidad}
                </span>
              )}
              {job?.experiencia && (
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                  💼 {job.experiencia}
                </span>
              )}
            </div>

            {/* Descripción del puesto */}
            {job?.descripcion && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Descripción del puesto
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.descripcion}
                  </p>
                </div>
              </div>
            )}

            {/* Requisitos */}
            {job?.requisitos && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Requisitos
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-blue-800 leading-relaxed whitespace-pre-line">
                    {job.requisitos}
                  </p>
                </div>
              </div>
            )}

            {/* Beneficios (si existen) */}
            {job?.beneficios && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center mb-4">
                  <span className="text-green-600 mr-2">🎁</span>
                  <h3 className="text-lg font-semibold text-green-900">
                    Beneficios
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-green-800 leading-relaxed whitespace-pre-line">
                    {job.beneficios}
                  </p>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500">ID del empleo</p>
                <p className="font-medium text-gray-900">{job?.id || "N/A"}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-medium text-gray-900">
                  {job?.categoria || "General"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium text-green-600">Activo</p>
              </div>
            </div>
          </div>

          {/* Footer con botones de acción mejorados */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Botón principal - Aplicar */}
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Aplicar a este empleo
              </button>

              {/* Botón Ver Empresa */}
              <button
                onClick={handleViewCompany}
                disabled={!job?.empresa_id}
                className="flex-1 bg-purple-100 text-purple-700 py-3 px-6 rounded-lg hover:bg-purple-200 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Ver Empresa
              </button>

              {/* Botón Cerrar */}
              <button
                onClick={handleClose}
                className="sm:flex-none bg-gray-100 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de empresa */}
      <CompanyModal
        companyId={job?.empresa_id}
        companyName={job?.nombre_empresa}
        isOpen={isCompanyModalOpen}
        onClose={handleCloseCompanyModal}
        onViewJob={handleViewJobFromCompany}
      />
    </>
  );
};

export default JobModal;
