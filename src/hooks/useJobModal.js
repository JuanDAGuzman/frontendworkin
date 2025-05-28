import { useState } from 'react';

// Hook para manejar el estado del modal de empleos
export const useJobModal = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openJobModal = (job) => {
    console.log('👁️ Abriendo modal de empleo:', job.titulo);
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeJobModal = () => {
    console.log('❌ Cerrando modal de empleo');
    setIsModalOpen(false);
    setTimeout(() => setSelectedJob(null), 300);
  };

  const switchToJob = (newJob) => {
    console.log('🔄 Cambiando a empleo:', newJob.titulo);
    
    // Crear un objeto de empleo compatible con el formato esperado
    const jobWithCompanyInfo = {
      ...newJob,
      // Si no tiene nombre_empresa, mantener el del job actual
      nombre_empresa: newJob.nombre_empresa || selectedJob?.nombre_empresa || 'Empresa no especificada'
    };
    
    setSelectedJob(jobWithCompanyInfo);
    setIsModalOpen(true);
  };

  return {
    selectedJob,
    isModalOpen,
    openJobModal,
    closeJobModal,
    switchToJob
  };
};

export default useJobModal;