
import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img 
            className="h-56 w-full object-cover md:w-56" 
            src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s/g, '')}${index}/400/600`} 
            alt={`A dish of ${recipe.recipeName}`} 
          />
        </div>
        <div className="p-6 md:p-8 flex-grow">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{recipe.recipeName}</h2>
          <p className="mt-2 text-slate-600">{recipe.description}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Ingredients
              </h3>
              <ul className="mt-2 space-y-1.5 text-slate-700">
                {recipe.ingredientsUsed.map((ing, i) => <li key={i} className="flex items-center"><span className="text-emerald-500 mr-2">✔</span>{ing} <span className="ml-2 text-xs text-slate-400 font-medium">(from your list)</span></li>)}
                {recipe.additionalIngredients.map((ing, i) => <li key={i} className="flex items-center"><span className="text-slate-400 mr-2">➕</span>{ing}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Instructions
              </h3>
              <ol className="mt-2 space-y-3 text-slate-700 list-decimal list-inside">
                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
