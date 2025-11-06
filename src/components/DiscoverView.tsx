import React, { useState, useMemo } from 'react';
import { Campaign, BetSide } from '../types';
import { CampaignCard } from './CampaignCard';

interface DiscoverViewProps {
  campaigns: Campaign[];
  onBet: (campaign: Campaign, side: BetSide) => void;
}

type NetworkFilter = 'All' | 'Base' | 'Celo' | 'Common';
type StatusFilter = 'Active' | 'Past';

const FilterButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
                ? 'bg-zora-blue text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
        {children}
    </button>
);

export const DiscoverView: React.FC<DiscoverViewProps> = ({ campaigns, onBet }) => {
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Active');
  
  const filteredCampaigns = useMemo(() => {
    const now = new Date();
    return campaigns
      .filter(campaign => {
        if (statusFilter === 'Active') {
          return campaign.endDate > now;
        }
        return campaign.endDate <= now;
      })
      .filter(campaign => {
        if (networkFilter === 'All') {
          return true;
        }
        return campaign.network === networkFilter;
      });
  }, [campaigns, statusFilter, networkFilter]);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Discover Campaigns</h2>
        <p className="text-gray-400">Support your favorite creators or challenge their hype.</p>
      </div>

      <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-300">Status:</span>
            <div className="flex space-x-2">
                <FilterButton onClick={() => setStatusFilter('Active')} isActive={statusFilter === 'Active'}>Active</FilterButton>
                <FilterButton onClick={() => setStatusFilter('Past')} isActive={statusFilter === 'Past'}>Past</FilterButton>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-300">Network:</span>
            <div className="flex space-x-2">
                 <FilterButton onClick={() => setNetworkFilter('All')} isActive={networkFilter === 'All'}>All</FilterButton>
                 <FilterButton onClick={() => setNetworkFilter('Base')} isActive={networkFilter === 'Base'}>Base</FilterButton>
                 <FilterButton onClick={() => setNetworkFilter('Celo')} isActive={networkFilter === 'Celo'}>Celo</FilterButton>
                 <FilterButton onClick={() => setNetworkFilter('Common')} isActive={networkFilter === 'Common'}>Common</FilterButton>
            </div>
          </div>
      </div>
      
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCampaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} onBet={onBet} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-300">No Campaigns Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};
