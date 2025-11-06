import React, { useState, useEffect } from 'react';
import { Campaign, BetSide } from '../types';
import { ShareIcon } from './icons/ShareIcon';

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
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const frameUrl = `${window.location.origin}/api/frame?campaignId=${campaign.id}`;
    navigator.clipboard.writeText(frameUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };
  
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg transition-all ${!isPast && 'hover:border-zora-blue hover:scale-[1.02]'} animate-fade-in ${isPast ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img src={campaign.nftImage} alt={campaign.tokenName} className="w-full h-48 object-cover" />
        <button 
          onClick={handleShare}
          className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-zora-blue"
          aria-label="Share campaign on Farcaster"
          title="Copy Farcaster Frame link"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <ShareIcon className="w-5 h-5" />
          )}
        </button>
      </div>
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
