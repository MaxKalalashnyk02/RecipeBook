'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipes, Recipe, FilterParams } from '@/lib/api';

function RecipeListContent() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentFilters: FilterParams = {
    ingredient: searchParams.get('ingredient') || undefined,
    country: searchParams.get('country') || undefined,
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
  };

  const getPageTitle = () => {
    if (currentFilters.ingredient) return `Recipes with ${currentFilters.ingredient}`;
    if (currentFilters.country) return `${currentFilters.country} Recipes`;
    if (currentFilters.category) return `${currentFilters.category} Recipes`;
    if (currentFilters.search) return `Search results for "${currentFilters.search}"`;
    return 'All Recipes';
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getRecipes(currentFilters);
      setRecipes(data);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    router.push('/');
  };

  useEffect(() => {
    fetchRecipes();
    if (currentFilters.search) {
      setSearchTerm(currentFilters.search);
    } else {
      setSearchTerm('');
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-orange-500 border-b-2 rounded-full w-32 h-32 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
            <div>
              <Link href="/" className="font-bold text-orange-600 hover:text-orange-700 text-2xl">
                🍳 Recipe Book
              </Link>
              <p className="mt-1 text-gray-600">Discover amazing recipes from around the world</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipes..."
                className="flex-1 px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg text-white transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-gray-900 text-3xl">{getPageTitle()}</h1>
          
          {(currentFilters.ingredient || currentFilters.country || currentFilters.category || currentFilters.search) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-gray-600 text-sm">Active filters:</span>
              {currentFilters.ingredient && (
                <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm">
                  Ingredient: {currentFilters.ingredient}
                </span>
              )}
              {currentFilters.country && (
                <span className="bg-green-100 px-3 py-1 rounded-full text-green-800 text-sm">
                  Country: {currentFilters.country}
                </span>
              )}
              {currentFilters.category && (
                <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-800 text-sm">
                  Category: {currentFilters.category}
                </span>
              )}
              {currentFilters.search && (
                <span className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 text-sm">
                  Search: {currentFilters.search}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 text-sm transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {recipes.length > 0 && (
            <p className="text-gray-600">Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 mb-6 px-4 py-3 border border-red-400 rounded text-red-700">
            {error}
            <button
              onClick={fetchRecipes}
              className="ml-4 text-red-800 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {recipes.length > 0 ? (
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <Link
                key={recipe.idMeal}
                href={`/recipe/${recipe.idMeal}`}
                className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
                    {recipe.strMeal}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {recipe.strCategory && (
                      <span className="bg-orange-100 px-2 py-1 rounded-full text-orange-800 text-xs">
                        {recipe.strCategory}
                      </span>
                    )}
                    {recipe.strArea && (
                      <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-800 text-xs">
                        {recipe.strArea}
                      </span>
                    )}
                  </div>
                  {recipe.strTags && (
                    <p className="text-gray-600 text-sm">
                      Tags: {recipe.strTags.split(',').slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : !loading && !error && (
          <div className="py-12 text-center">
            <div className="mb-4 text-gray-400 text-6xl">🔍</div>
            <h3 className="mb-2 font-semibold text-gray-900 text-xl">No recipes found</h3>
            <p className="mb-4 text-gray-600">
              Try adjusting your search or filters to find more recipes.
            </p>
            <button
              onClick={clearFilters}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg text-white transition-colors"
            >
              View All Recipes
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-orange-500 border-b-2 rounded-full w-32 h-32 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RecipeListContent />
    </Suspense>
  );
}
