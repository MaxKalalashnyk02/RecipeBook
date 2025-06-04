import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Response Error:', error.message);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export interface Ingredient {
  ingredient: string;
  measure: string;
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  ingredients: Ingredient[];
  strSource?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

export interface FilterParams {
  ingredient?: string;
  country?: string;
  category?: string;
  search?: string;
}

const handleApiError = (error: unknown, fallbackMessage: string): never => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message.includes('Network Error')) {
      throw new Error('Network error: Please check if the backend server is running');
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Connection refused: Backend server is not accessible');
    }
  }
  
  console.error('Unexpected error:', error);
  throw new Error(fallbackMessage);
};

const makeApiCall = async <T>(endpoint: string, errorMessage: string): Promise<T> => {
  try {
    const response = await api.get<ApiResponse<T>>(endpoint);
    return response.data.data;
  } catch (error) {
    return handleApiError(error, errorMessage);
  }
};

export const getRecipes = async (filters?: FilterParams): Promise<Recipe[]> => {
  const params = new URLSearchParams();
  
  if (filters?.ingredient) params.append('ingredient', filters.ingredient);
  if (filters?.country) params.append('country', filters.country);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);

  const endpoint = `/api/recipes${params.toString() ? `?${params.toString()}` : ''}`;
  return makeApiCall<Recipe[]>(endpoint, 'Failed to fetch recipes');
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  if (!id) {
    throw new Error('Recipe ID is required');
  }
  
  return makeApiCall<Recipe>(`/api/recipes/${id}`, 'Failed to fetch recipe details');
};

export const getRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  if (!category) {
    throw new Error('Category is required');
  }
  
  return makeApiCall<Recipe[]>(`/api/recipes/category/${category}`, 'Failed to fetch category recipes');
};

export { api }; 