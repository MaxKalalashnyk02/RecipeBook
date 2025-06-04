import { Router } from 'express';
import { getRecipes, getRecipeById, getRecipesByCategory } from '../controllers/recipeController';

const router = Router();

router.get('/', getRecipes);

router.get('/category/:category', getRecipesByCategory);

router.get('/:id', getRecipeById);

export default router; 