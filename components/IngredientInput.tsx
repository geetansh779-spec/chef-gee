
import React, { useState } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addIngredient = () => {
    const trimmedInput = inputValue.trim().toLowerCase();
    if (trimmedInput && !ingredients.includes(trimmedInput)) {
      setIngredients([...ingredients, trimmedInput]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newIngredients = pastedText
      .split(/,|\n/)
      .map(ing => ing.trim().toLowerCase())
      .filter(ing => ing && !ingredients.includes(ing));
    
    if (newIngredients.length > 0) {
        setIngredients([...ingredients, ...newIngredients]);
    }
  };


  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-100 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
        {ingredients.map((ingredient) => (
          <div key={ingredient} className="flex items-center bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
            <span>{ingredient}</span>
            <button onClick={() => removeIngredient(ingredient)} className="ml-2 text-emerald-600 hover:text-emerald-800 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={ingredients.length === 0 ? "Add ingredients (e.g., chicken, rice)..." : "Add another..."}
          className="flex-grow bg-transparent p-1 focus:outline-none"
        />
      </div>
       <p className="text-xs text-slate-500 mt-2 text-center">Press Enter to add an ingredient. You can also paste a comma-separated list.</p>
    </div>
  );
};

export default IngredientInput;
