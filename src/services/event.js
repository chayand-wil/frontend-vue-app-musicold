import api from '../axios'

const API_URL = '/event'; //
/**
 * Obtiene un evento
 */
export const fetchOneEvent = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error en fetchOneEvent:', error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};