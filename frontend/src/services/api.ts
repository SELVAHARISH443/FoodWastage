import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Recipe API calls
export const getRecipes = async () => {
    const response = await api.get('/api/recipes');
    return response.data;
};

export const getRecipeByName = async (name: string) => {
    const response = await api.get(`/api/recipes/${encodeURIComponent(name)}`);
    return response.data;
};

// Surplus Food API calls
export const createSurplus = async (data: {
    dishName: string;
    quantity: string;
    location: string;
    notes?: string;
    expiresIn: string;
    provider: string;
    contact: string;
}) => {
    const response = await api.post('/api/surplus', data);
    return response.data;
};

export const getAllSurplus = async () => {
    const response = await api.get('/api/surplus');
    return response.data;
};

export const getSurplusById = async (id: string) => {
    const response = await api.get(`/api/surplus/${id}`);
    return response.data;
};

export const deleteSurplus = async (id: string) => {
    const response = await api.delete(`/api/surplus/${id}`);
    return response.data;
};

export default api;
