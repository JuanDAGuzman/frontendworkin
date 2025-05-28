const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Servicio API con reintentos automáticos y manejo de errores mejorado
export const jobsAPI = {
  getJobs: async (params = {}, retryCount = 0) => {
    const maxRetries = 2;

    try {
      const queryParams = new URLSearchParams();

      // Solo agregar parámetros que tienen valor y no están vacíos
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined && value !== 0) {
          queryParams.append(key, value);
        }
      });

      const url = `${API_BASE_URL}/jobs?${queryParams}`;
      console.log('🌐 API URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response exitosa:', data.empleos?.length || 0, 'empleos');

      return data;
    } catch (error) {
      console.error('❌ Error en API:', error.message);

      if (retryCount < maxRetries && (
        error.name === 'TypeError' ||
        error.name === 'AbortError' ||
        error.message.includes('fetch')
      )) {
        console.log(`🔄 Reintentando... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return jobsAPI.getJobs(params, retryCount + 1);
      }

      throw error;
    }
  },

  // Función para obtener un empleo específico por ID
  getJobById: async (jobId, retryCount = 0) => {
    const maxRetries = 2;

    try {
      const url = `${API_BASE_URL}/jobs/${jobId}`;
      console.log('🔍 Job by ID API URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Empleo no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Job by ID Response exitosa:', data.titulo);

      return data;
    } catch (error) {
      console.error('❌ Error en Job by ID API:', error.message);

      if (retryCount < maxRetries && (
        error.name === 'TypeError' ||
        error.name === 'AbortError' ||
        (error.message.includes('fetch') && !error.message.includes('404'))
      )) {
        console.log(`🔄 Reintentando job by ID... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return jobsAPI.getJobById(jobId, retryCount + 1);
      }

      throw error;
    }
  },

  // Función para obtener información de la empresa
  getCompanyById: async (companyId, retryCount = 0) => {
    const maxRetries = 2;

    try {
      const url = `${API_BASE_URL}/companies/${companyId}`;
      console.log('🏢 Company API URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Empresa no encontrada');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Company Response exitosa:', data.nombre);

      return data;
    } catch (error) {
      console.error('❌ Error en Company API:', error.message);

      if (retryCount < maxRetries && (
        error.name === 'TypeError' ||
        error.name === 'AbortError' ||
        (error.message.includes('fetch') && !error.message.includes('404'))
      )) {
        console.log(`🔄 Reintentando company... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return jobsAPI.getCompanyById(companyId, retryCount + 1);
      }

      throw error;
    }
  }
};

// ✅ Solo una exportación por defecto al final y al nivel superior
export default jobsAPI;
