// src/services/apiService.js
import api from '../axios'

const API_URL = '/reports'; //

export const fetchTotalSales = async () => {
  try {
    const response = await api.get(API_URL+'total-sales');
    return response.data.data;
  } catch (error) {
    console.error('Error en fetchArtists:', error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};


export const fetchTopClients = async () => {
  try {
    const response = await api.get(API_URL+'top-clients');
    return response.data.data;
  } catch (error) {
    console.error('Error en fetchArtists:', error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};

export const fetchArticlesSales = async () => {
  try {
    const response = await api.get(API_URL+'articles-sales');
    return response.data.data;
  } catch (error) {
    console.error('Error en fetchArtists:', error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};

export const fetchArticlesRating = async () => {
  try {
    const response = await api.get(API_URL+'articles-rating');
    return response.data.data;
  } catch (error) {
    console.error('Error en fetchArtists:', error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};


