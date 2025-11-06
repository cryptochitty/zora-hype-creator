import React from 'react';

interface WelcomeViewProps {
  onEnter: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center animate-fade-in p-4">
      <div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          Zora<span className="text-zora-blue">Hype</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          The prediction market for Zora creator tokens.
          Support your favorite creators, or challenge their hype and earn rewards.
        </p>
        <button
          onClick={onEnter}
          className="bg-zora-purple text-white font-bold py-3 px-8 rounded-md text-lg hover:scale-105 transition-transform"
        >
          Enter App
        </button>
      </div>
    </div>
  );
};
