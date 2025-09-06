
import React, { useState, useCallback } from 'react';
import type { Recipe } from './types';
import { generateRecipes } from './services/geminiService';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['flour', 'sugar', 'eggs']);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const generatedRecipes = await generateRecipes(ingredients);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
      setError('Sorry, we had trouble generating recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);

  const loadingMessages = [
    "Preheating the oven...",
    "Chopping the vegetables...",
    "Simmering up some ideas...",
    "Whisking the ingredients...",
    "Consulting with our AI chef...",
  ];
  
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  React.useEffect(() => {
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
  }, [isLoading, loadingMessages]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
          <p className="text-center text-slate-600 mb-4">
            Enter the ingredients you have, and our AI chef will whip up some delicious recipe ideas for you!
          </p>
          <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
          <div className="mt-6 text-center">
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
          
          {!isLoading && recipes.length === 0 && !error && (
             <div className="text-center py-10 px-6 bg-white rounded-2xl shadow-md border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="mt-4 text-2xl font-bold text-slate-800">Ready to cook?</h3>
                <p className="mt-2 text-slate-500">Your delicious recipe suggestions will appear here.</p>
            </div>
          )}

          <div className="grid gap-8 md:gap-12 mt-8">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} index={index} />
            ))}
          </div>
        </div>
      </main>
       <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
