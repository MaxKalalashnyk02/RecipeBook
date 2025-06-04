import { Request, Response } from 'express';
import axios from 'axios';
import { MealDbResponse, Meal, ProcessedMeal, Ingredient, FilterQuery } from '../types';

const MEAL_DB_BASE_URL = process.env.MEAL_DB_BASE_URL || 'https://www.themealdb.com/api/json/v1/1';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data?: any, count?: number) => {
  const response: any = { success, message };
  if (data !== undefined) response.data = data;
  if (count !== undefined) response.count = count;
  res.status(statusCode).json(response);
};

const handleError = (res: Response, error: unknown, defaultMessage: string) => {
  console.error(`Error: ${defaultMessage}`, error);
  sendResponse(res, 500, false, defaultMessage, undefined, undefined);
};

const processMealData = (meal: Meal): ProcessedMeal => {
  const ingredients: Ingredient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string;
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      });
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
    strInstructions: meal.strInstructions,
    strMealThumb: meal.strMealThumb,
    strTags: meal.strTags,
    strYoutube: meal.strYoutube,
    ingredients,
    strSource: meal.strSource
  };
};

const buildApiUrl = (filters: FilterQuery): string => {
  const { ingredient, country, category, search } = filters;
  
  if (search) {
    return `${MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(search)}`;
  }
  if (ingredient) {
    return `${MEAL_DB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`;
  }
  if (country) {
    return `${MEAL_DB_BASE_URL}/filter.php?a=${encodeURIComponent(country)}`;
  }
  if (category) {
    return `${MEAL_DB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`;
  }
  
  return `${MEAL_DB_BASE_URL}/search.php?s=`;
};

export const getRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = req.query as FilterQuery;
    const url = buildApiUrl(filters);

    const response = await axios.get<MealDbResponse>(url);
    const meals = response.data.meals;

    if (!meals) {
      sendResponse(res, 404, false, 'No recipes found', []);
      return;
    }

    const processedMeals = meals.map(meal => {
      if (meal.strInstructions) {
        return processMealData(meal);
      } else {
        return {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory || '',
          strArea: meal.strArea || '',
          strInstructions: '',
          ingredients: [],
          strTags: meal.strTags,
          strYoutube: meal.strYoutube,
          strSource: meal.strSource
        };
      }
    });

    sendResponse(res, 200, true, 'Recipes retrieved successfully', processedMeals, processedMeals.length);

  } catch (error) {
    handleError(res, error, 'Failed to fetch recipes');
  }
};

export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendResponse(res, 400, false, 'Recipe ID is required');
      return;
    }

    const url = `${MEAL_DB_BASE_URL}/lookup.php?i=${id}`;
    const response = await axios.get<MealDbResponse>(url);
    const meals = response.data.meals;

    if (!meals || meals.length === 0) {
      sendResponse(res, 404, false, 'Recipe not found');
      return;
    }

    const processedMeal = processMealData(meals[0]);
    sendResponse(res, 200, true, 'Recipe retrieved successfully', processedMeal);

  } catch (error) {
    handleError(res, error, 'Failed to fetch recipe');
  }
};

export const getRecipesByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;

    if (!category) {
      sendResponse(res, 400, false, 'Category is required');
      return;
    }

    const url = `${MEAL_DB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`;
    const response = await axios.get<MealDbResponse>(url);
    const meals = response.data.meals;

    if (!meals) {
      sendResponse(res, 404, false, 'No recipes found for this category', []);
      return;
    }

    const limitedMeals = meals.slice(0, 10).map(meal => ({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory || category
    }));

    sendResponse(res, 200, true, 'Category recipes retrieved successfully', limitedMeals, limitedMeals.length);

  } catch (error) {
    handleError(res, error, 'Failed to fetch category recipes');
  }
};
