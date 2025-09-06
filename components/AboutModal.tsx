import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative bg-white w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 z-10 animate-fade-in-up">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="about-modal-title" className="text-2xl font-bold text-slate-900">About Chef Gee</h2>
        
        <div className="mt-4 space-y-4 text-slate-600">
          <p>
            Welcome to your personal AI sous-chef! This application helps you fight food waste and discover new culinary creations by generating recipes from the ingredients you already have at home.
          </p>
          
          <div>
            <h3 className="font-semibold text-slate-800">How It Works</h3>
            <p className="mt-1">
              This app is powered by Google's Gemini API, a powerful artificial intelligence model. When you enter your ingredients and click "Generate Recipes," your list is sent to the Gemini API, which creatively crafts three distinct recipe ideas tailored to your pantry.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">Your Data & Privacy</h3>
            <p className="mt-1">
              We respect your privacy. The list of ingredients you provide is used solely for the purpose of generating recipes and is not stored or linked to any personal information. Recipe ratings are stored anonymously in your browser's local storage to calculate and display average ratings.
            </p>
          </div>

          <div className="text-sm pt-2 border-t border-slate-200">
            For more information, please review our (placeholder) policies:
            <div className="mt-2 space-x-4">
              <a href="#" className="text-emerald-600 hover:text-emerald-800 underline">Privacy Policy</a>
              <a href="#" className="text-emerald-600 hover:text-emerald-800 underline">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default AboutModal;