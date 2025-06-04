'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById, getRecipesByCategory, Recipe } from '@/lib/api';

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [categoryRecipes, setCategoryRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const recipeData = await getRecipeById(id);
      setRecipe(recipeData);
      
      if (recipeData.strCategory) {
        try {
          const categoryData = await getRecipesByCategory(recipeData.strCategory);
          const filteredCategoryRecipes = categoryData
            .filter(r => r.idMeal !== recipeData.idMeal)
            .slice(0, 8);
          setCategoryRecipes(filteredCategoryRecipes);
        } catch (categoryError) {
          console.warn('Failed to fetch category recipes:', categoryError);
          setCategoryRecipes([]);
        }
      }
      
    } catch (err) {
      setError('Failed to fetch recipe details. Please try again.');
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecipeDetails();
    }
  }, [id]);

  const handleIngredientClick = (ingredient: string) => {
    router.push(`/?ingredient=${encodeURIComponent(ingredient)}`);
  };

  const handleCountryClick = (country: string) => {
    router.push(`/?country=${encodeURIComponent(country)}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/?category=${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-orange-500 border-b-2 rounded-full w-32 h-32 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="max-w-md text-center">
          <div className="mb-4 text-gray-400 text-6xl">😕</div>
          <h2 className="mb-2 font-bold text-gray-900 text-2xl">Recipe Not Found</h2>
          <p className="mb-6 text-gray-600">{error || 'The recipe you are looking for does not exist.'}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-lg text-white transition-colors"
            >
              Go Back
            </button>
            <Link
              href="/"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg text-white transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
            <Link href="/" className="font-bold text-orange-600 hover:text-orange-700 text-xl">
              🍳 Recipe Book
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="lg:gap-8 lg:grid lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                <div className="p-6 md:w-2/3">
                  <h1 className="mb-4 font-bold text-gray-900 text-3xl md:text-left text-center">
                    {recipe.strMeal}
                  </h1>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {recipe.strArea && (
                      <button
                        onClick={() => handleCountryClick(recipe.strArea)}
                        className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-blue-800 text-sm transition-colors cursor-pointer"
                      >
                        📍 {recipe.strArea}
                      </button>
                    )}
                    {recipe.strCategory && (
                      <button
                        onClick={() => handleCategoryClick(recipe.strCategory)}
                        className="bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-full text-orange-800 text-sm transition-colors cursor-pointer"
                      >
                        🏷️ {recipe.strCategory}
                      </button>
                    )}
                  </div>

                  {recipe.strTags && (
                    <div className="mb-4">
                      <p className="mb-1 text-gray-600 text-sm">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.strTags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-xs"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {recipe.strYoutube && (
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                      📺 Watch on YouTube
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6 border-t">
                <div className="lg:gap-8 lg:grid lg:grid-cols-2">
                  <div>
                    <h2 className="mb-4 font-bold text-gray-900 text-2xl">Ingredients</h2>
                    <div className="space-y-2">
                      {recipe.ingredients.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <button
                            onClick={() => handleIngredientClick(item.ingredient)}
                            className="font-medium text-gray-900 hover:text-orange-600 text-left transition-colors cursor-pointer"
                          >
                            {item.ingredient}
                          </button>
                          <span className="ml-4 text-gray-600 text-sm">
                            {item.measure}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-4 font-bold text-gray-900 text-2xl">Instructions</h2>
                    <div className="max-w-none prose prose-sm">
                      {recipe.strInstructions.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {recipe.strSource && (
                  <div className="mt-8 pt-6 border-t">
                    <a
                      href={recipe.strSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 text-sm"
                    >
                      🔗 View Original Recipe Source
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h3 className="mb-4 font-bold text-gray-900 text-lg">
                More {recipe.strCategory} Recipes
              </h3>
              
              {categoryRecipes.length > 0 ? (
                <div className="space-y-4">
                  {categoryRecipes.map((categoryRecipe) => (
                    <Link
                      key={categoryRecipe.idMeal}
                      href={`/recipe/${categoryRecipe.idMeal}`}
                      className="group block"
                    >
                      <div className="flex gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <div className="relative flex-shrink-0 w-16 h-16">
                          <Image
                            src={categoryRecipe.strMealThumb}
                            alt={categoryRecipe.strMeal}
                            fill
                            className="rounded object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-orange-600 text-sm line-clamp-2 transition-colors">
                            {categoryRecipe.strMeal}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  <button
                    onClick={() => handleCategoryClick(recipe.strCategory)}
                    className="hover:bg-orange-50 mt-4 px-4 py-2 border border-orange-600 rounded-lg w-full text-orange-600 text-sm transition-colors"
                  >
                    View All {recipe.strCategory} Recipes
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No related recipes found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 