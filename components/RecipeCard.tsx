import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

// Helper to sanitize recipe names for use as localStorage keys
const sanitizeKey = (name: string) => {
    return name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};


const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index, isFavorite, onToggleFavorite }) => {
  const recipeKey = sanitizeKey(recipe.recipeName);
  
  const [rating, setRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const allRatingsStr = localStorage.getItem('recipeRatings');
      if (allRatingsStr) {
        const allRatings = JSON.parse(allRatingsStr);
        const recipeRatings: number[] = allRatings[recipeKey];
        if (recipeRatings && recipeRatings.length > 0) {
          const sum = recipeRatings.reduce((acc, r) => acc + r, 0);
          setRating({
            average: sum / recipeRatings.length,
            count: recipeRatings.length,
          });
        }
      }
    } catch(e) {
      console.error("Failed to parse ratings from localStorage", e);
    }
  }, [recipeKey]);

  const handleRating = (newRating: number) => {
    if (userHasRated) return;

    try {
      const allRatingsStr = localStorage.getItem('recipeRatings');
      const allRatings = allRatingsStr ? JSON.parse(allRatingsStr) : {};
      const currentRatings = allRatings[recipeKey] || [];
      
      const updatedRatings = [...currentRatings, newRating];
      allRatings[recipeKey] = updatedRatings;
      
      localStorage.setItem('recipeRatings', JSON.stringify(allRatings));
      
      const newSum = updatedRatings.reduce((acc, r) => acc + r, 0);
      setRating({
          average: newSum / updatedRatings.length,
          count: updatedRatings.length
      });
      setUserHasRated(true);
    } catch (e) {
      console.error("Failed to save rating to localStorage", e);
    }
  };
  
  const handleToggleIngredient = (ingredient: string) => {
    setCheckedIngredients(prevChecked => {
      const newChecked = new Set(prevChecked);
      if (newChecked.has(ingredient)) {
        newChecked.delete(ingredient);
      } else {
        newChecked.add(ingredient);
      }
      return newChecked;
    });
  };


  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-56 overflow-hidden">
          <img 
            className="h-48 w-full object-cover md:h-full transition-transform duration-500 ease-in-out group-hover:scale-105" 
            src={recipe.imageUrl} 
            alt={`A delicious looking dish of ${recipe.recipeName}`} 
          />
        </div>
        <div className="p-6 md:p-8 flex-grow">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight pr-4">{recipe.recipeName}</h2>
            <button
              onClick={() => onToggleFavorite(recipe)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="flex-shrink-0 p-2 rounded-full hover:bg-rose-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all duration-300 ${isFavorite ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <p className="mt-2 text-slate-600">{recipe.description}</p>
          
          {/* RATING SECTION START */}
          <div className="mt-4 p-3 bg-slate-100/70 rounded-lg border">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-1"
                onMouseLeave={() => setHoverRating(0)}
                role="radiogroup"
              >
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <button
                      key={i}
                      aria-label={`Rate ${starValue} stars`}
                      role="radio"
                      aria-checked={starValue === Math.round(rating.average)}
                      disabled={userHasRated}
                      onMouseEnter={() => !userHasRated && setHoverRating(starValue)}
                      onClick={() => handleRating(starValue)}
                      className="disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${starValue <= (hoverRating || Math.round(rating.average)) ? 'text-amber-400' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  );
                })}
              </div>
              <div className="text-sm text-slate-600 font-medium">
                {userHasRated ? (
                  <span className="text-emerald-600 font-semibold">Thanks for rating!</span>
                ) : rating.count > 0 ? (
                  <span>
                    {rating.average.toFixed(1)} stars ({rating.count} {rating.count === 1 ? 'rating' : 'ratings'})
                  </span>
                ) : (
                  <span>Be the first to rate!</span>
                )}
              </div>
            </div>
          </div>
          {/* RATING SECTION END */}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Ingredients
              </h3>
              <div className="space-y-4">
                {recipe.ingredientsUsed.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-600">From your list:</p>
                    <ul className="mt-2 space-y-2">
                      {recipe.ingredientsUsed.map((ing, i) => {
                        const isChecked = checkedIngredients.has(ing);
                        return (
                          <li key={`used-${i}`}>
                            <label className="flex items-center group cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleIngredient(ing)}
                                aria-label={`Mark ${ing} as used`}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition duration-150 ease-in-out"
                              />
                              <span className={`ml-3 transition-all duration-150 ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {ing}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {recipe.additionalIngredients.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-600">You'll also need:</p>
                    <ul className="mt-2 space-y-2">
                      {recipe.additionalIngredients.map((ing, i) => {
                        const isChecked = checkedIngredients.has(ing);
                        return (
                           <li key={`additional-${i}`}>
                            <label className="flex items-center group cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleIngredient(ing)}
                                aria-label={`Mark ${ing} as needed`}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition duration-150 ease-in-out"
                              />
                              <span className={`ml-3 transition-all duration-150 ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {ing}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Instructions
              </h3>
              <ol className="mt-2 space-y-3 text-slate-700 list-decimal list-inside marker:text-slate-500 marker:font-semibold">
                {recipe.instructions.map((step, i) => <li key={i} className="pl-1">{step}</li>)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;