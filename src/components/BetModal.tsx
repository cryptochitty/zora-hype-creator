import React, { useState } from 'react';
import { Campaign, BetSide, Token } from '../types';

interface BetModalProps {
  campaign: Campaign | null;
  side: BetSide | null;
  onClose: () => void;
  onConfirm: (campaign: Campaign, side: BetSide, amount: number, token: Token) => void;
}

export const BetModal: React.FC<BetModalProps> = ({ campaign, side, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('1');
  const [token, setToken] = useState<Token>(Token.ZORA);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!campaign || side === null) return null;

  const handleConfirm = () => {
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount < 1) {
        alert("You must bet at least 1 token.");
        return;
    }
    setIsConfirming(true);
    // Simulate transaction
    setTimeout(() => {
        onConfirm(campaign, side, numericAmount, token);
        setIsConfirming(false);
        onClose();
    }, 1500);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow integer values
    const value = e.target.value;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
        setAmount(value);
    }
  }

  const sideClass = side === BetSide.Supporter ? 'text-supporter-green' : 'text-hatter-red';
  const sideBgClass = side === BetSide.Supporter ? 'bg-supporter-green' : 'bg-hatter-red';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            You are <span className={sideClass}>{side === BetSide.Supporter ? 'Supporting' : 'Hating'}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="flex items-center mb-6">
            <img src={campaign.nftImage} alt={campaign.tokenName} className="w-16 h-16 rounded-md mr-4 object-cover"/>
            <div>
                <p className="font-semibold text-lg">{campaign.tokenName}</p>
                <p className="text-gray-400 text-sm">by {campaign.creator}</p>
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Number of Bets</label>
            <div className="flex items-stretch">
                <input 
                    type="number" 
                    value={amount}
                    min="1"
                    step="1"
                    onChange={handleAmountChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-l-md p-3 text-white focus:ring-zora-blue focus:border-zora-blue transition"
                />
                <select 
                    value={token}
                    onChange={(e) => setToken(e.target.value as Token)}
                    className="bg-gray-700 border border-gray-600 border-l-0 rounded-r-md p-3 text-white focus:ring-zora-blue focus:border-zora-blue transition"
                >
                    <option value={Token.ZORA}>ZORA</option>
                    <option value={Token.ETH}>ETH</option>
                    <option value={Token.USDC}>USDC</option>
                </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">1 token ≈ $1 per bet.</p>
        </div>

        <div className="mt-6">
            <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className={`w-full ${sideBgClass} text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-80 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center`}
            >
             {isConfirming ? (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
             ) : `Confirm ${side}`}
            </button>
        </div>
      </div>
    </div>
  );
};
