import React from 'react';
import { View } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
                ? 'bg-zora-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white mr-6">
                Zora<span className="text-zora-blue">Hype</span>
            </h1>
            <nav className="hidden md:flex items-center space-x-2">
                <NavButton onClick={() => setView(View.Discover)} isActive={currentView === View.Discover}>
                    Discover
                </NavButton>
                <NavButton onClick={() => setView(View.Portfolio)} isActive={currentView === View.Portfolio}>
                    Portfolio
                </NavButton>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={() => setView(View.Create)} className="flex items-center bg-zora-purple text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-80 transition-all text-sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Campaign
             </button>
             <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};
