import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Recipe } from './types';
import { generateRecipes } from './services/geminiService';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import Spinner from './components/Spinner';
import AboutModal from './components/AboutModal';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['flour', 'sugar', 'eggs']);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [dietaryPreference, setDietaryPreference] = useState<string>('None');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    try {
      const savedFavorites = localStorage.getItem('favoriteRecipes');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (recipe: Recipe) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.recipeName === recipe.recipeName);
      if (isFavorited) {
        return prevFavorites.filter(fav => fav.recipeName !== recipe.recipeName);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };

  const favoriteRecipeNames = useMemo(() => 
    new Set(favorites.map(fav => fav.recipeName)), 
    [favorites]
  );

  const handleGenerateRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setShowFavoritesOnly(false); // Switch back to recipe view on new generation

    try {
      const generatedRecipes = await generateRecipes(ingredients, dietaryPreference);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
      setError('Sorry, we had trouble generating recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, dietaryPreference]);

  const loadingMessages = [
    "Preheating the oven...",
    "Chopping the vegetables...",
    "Simmering up some ideas...",
    "Consulting with our AI chef...",
    "Sketching out the plating...",
    "Photographing the final dish...",
  ];
  
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const dietaryOptions = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free'];
  const displayedRecipes = showFavoritesOnly ? favorites : recipes;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
          <p className="text-center text-slate-600 mb-4">
            Enter the ingredients you have, and our AI chef will whip up some delicious recipe ideas for you!
          </p>
          <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
          
          <div className="mt-6">
            <label className="block text-center text-sm font-medium text-slate-700 mb-3">Dietary Preference & Filters</label>
            <div className="flex justify-center flex-wrap gap-2">
              {dietaryOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setDietaryPreference(option)}
                  disabled={showFavoritesOnly}
                  className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    dietaryPreference === option && !showFavoritesOnly
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {option}
                </button>
              ))}
               <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 flex items-center gap-2 ${
                    showFavoritesOnly
                      ? 'bg-rose-500 text-white border-rose-500 shadow' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  My Favorites
                </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={handleGenerateRecipes}
              disabled={isLoading || ingredients.length === 0}
              className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {isLoading ? 'Generating...' : 'Generate Recipes'}
            </button>
          </div>
        </div>

        <div className="mt-12">
          {isLoading && (
            <div className="text-center">
              <Spinner />
              <p className="mt-4 text-lg text-slate-600 font-medium">{loadingMessage}</p>
            </div>
          )}
          {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
          
          {!isLoading && displayedRecipes.length === 0 && !error && (
             <div className="text-center py-10 px-6 bg-white rounded-2xl shadow-md border border-slate-200">
                {showFavoritesOnly ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <h3 className="mt-4 text-2xl font-bold text-slate-800">No Favorites Yet</h3>
                    <p className="mt-2 text-slate-500">Click the heart icon on a recipe to save it here.</p>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <h3 className="mt-4 text-2xl font-bold text-slate-800">Ready to cook?</h3>
                    <p className="mt-2 text-slate-500">Your delicious recipe suggestions will appear here.</p>
                  </>
                )}
            </div>
          )}

          <div className="grid gap-8 md:gap-12 mt-8">
            {displayedRecipes.map((recipe, index) => (
              <RecipeCard 
                key={recipe.recipeName} 
                recipe={recipe} 
                index={index} 
                isFavorite={favoriteRecipeNames.has(recipe.recipeName)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      </main>
       <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
        <button 
          onClick={() => setIsAboutModalOpen(true)} 
          className="mt-2 text-emerald-600 hover:text-emerald-800 underline transition-colors"
        >
          About this App
        </button>
      </footer>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </div>
  );
};

export default App;