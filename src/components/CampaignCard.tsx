import React, { useState, useEffect } from 'react';
import { Campaign, BetSide } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onBet: (campaign: Campaign, side: BetSide) => void;
}

const Countdown: React.FC<{ endDate: Date }> = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const difference = +endDate - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="flex space-x-2 text-xs text-gray-300">
      {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
      <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onBet }) => {
  const totalPool = campaign.supporterPool + campaign.hatterPool;
  const supporterPercent = totalPool > 0 ? (campaign.supporterPool / totalPool) * 100 : 50;
  const isPast = new Date() > campaign.endDate;
  
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg transition-all ${!isPast && 'hover:border-zora-blue hover:scale-[1.02]'} animate-fade-in ${isPast ? 'opacity-60' : ''}`}>
      <img src={campaign.nftImage} alt={campaign.tokenName} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img src={campaign.creatorAvatar} alt={campaign.creator} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-600" />
          <div>
            <p className="font-bold text-lg">{campaign.tokenName}</p>
            <p className="text-sm text-gray-400">by {campaign.creator}</p>
          </div>
        </div>

        <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span className="font-semibold text-supporter-green">Supporters</span>
                <span className="font-semibold text-hatter-red">Hatters</span>
            </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-supporter-green h-2.5 rounded-l-full" style={{ width: `${supporterPercent}%` }}></div>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
                <span className="font-bold text-white">${campaign.supporterPool.toLocaleString()}</span>
                <span className="font-bold text-white">${campaign.hatterPool.toLocaleString()}</span>
            </div>
        </div>

        <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-md mb-4">
            <span className="text-sm text-gray-300 font-medium">{isPast ? 'Status' : 'Time Left'}</span>
            {isPast ? <span className="text-xs font-bold text-gray-400">Ended</span> : <Countdown endDate={campaign.endDate} />}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onBet(campaign, BetSide.Supporter)} 
            disabled={isPast}
            className="w-full bg-supporter-green text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed">
            Support
          </button>
          <button 
            onClick={() => onBet(campaign, BetSide.Hatter)}
            disabled={isPast}
            className="w-full bg-hatter-red text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed">
            Hate
          </button>
        </div>
      </div>
    </div>
  );
};
