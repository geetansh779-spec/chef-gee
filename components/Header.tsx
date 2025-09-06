
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.258 5.234a.75.75 0 00.516 1.086h13.484a.75.75 0 00.516-1.086C16.454 11.665 16 9.887 16 8a6 6 0 00-6-6z" />
            <path d="M10 18a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0010 18z" />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Chef Gemini
          </h1>
        </div>
        <p className="mt-1 text-slate-500">Your Personal AI Sous-Chef</p>
      </div>
    </header>
  );
};

export default Header;
