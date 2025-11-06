import React, { useState } from 'react';
import { Header } from './components/Header';
import { WelcomeView } from './components/WelcomeView';
import { DiscoverView } from './components/DiscoverView';
import { PortfolioView } from './components/PortfolioView';
import { CreateCampaignView } from './components/CreateCampaignView';
import { BetModal } from './components/BetModal';
import { View, Campaign, BetSide, UserPosition, Token, PositionStatus } from './types';
import { FarcasterIcon } from './components/icons/FarcasterIcon';

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    creator: 'greg',
    creatorAvatar: 'https://i.imgur.com/8p3y1mJ.png',
    tokenName: 'GREG',
    nftImage: 'https://i.imgur.com/zPR6L1b.png',
    zoraLink: 'https://zora.co/collect/base:0x9c14958c214c85731336a3e1445213601ff34633/1',
    supporterPool: 12500,
    hatterPool: 7800,
    endDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    network: 'Base',
  },
  {
    id: 2,
    creator: 'degen',
    creatorAvatar: 'https://i.imgur.com/rL7q6sC.png',
    tokenName: 'DEGEN',
    nftImage: 'https://i.imgur.com/w1iAqL4.png',
    zoraLink: 'https://zora.co/collect/base:0x50d41e21b009382f668da0ac8d12140a50f55da2/1',
    supporterPool: 8900,
    hatterPool: 11200,
    endDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    network: 'Base',
  },
  {
    id: 3,
    creator: 'nouns',
    creatorAvatar: 'https://i.imgur.com/5J3d2qG.png',
    tokenName: 'NOUNS',
    nftImage: 'https://i.imgur.com/55S4Gmm.png',
    zoraLink: 'https://zora.co/collect/base:0x2d87a5d60924b16b9b2226227c28b5501a61356f/1',
    supporterPool: 45000,
    hatterPool: 22000,
    endDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    network: 'Common',
  },
];

const mockPositions: UserPosition[] = [
  {
    id: 1,
    campaign: mockCampaigns[0],
    side: BetSide.Supporter,
    amount: 100,
    token: Token.ZORA,
    status: PositionStatus.Active,
  },
  {
    id: 2,
    campaign: mockCampaigns[2],
    side: BetSide.Hatter,
    amount: 50,
    token: Token.USDC,
    status: PositionStatus.Won,
    isClaimed: false,
  },
  {
    id: 3,
    campaign: { ...mockCampaigns[2], id: 4, endDate: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000) },
    side: BetSide.Supporter,
    amount: 200,
    token: Token.ETH,
    status: PositionStatus.Lost,
  },
  {
    id: 4,
    campaign: { ...mockCampaigns[2], id: 5, supporterPool: 10000, hatterPool: 30000, endDate: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000) },
    side: BetSide.Supporter,
    amount: 250,
    token: Token.ZORA,
    status: PositionStatus.Won,
    isClaimed: true,
  },
];

const App: React.FC = () => {
  const [view, setView] = useState<View | null>(null);
  const [campaigns] = useState<Campaign[]>(mockCampaigns); // removed unused setter
  const [positions, setPositions] = useState<UserPosition[]>(mockPositions);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedSide, setSelectedSide] = useState<BetSide | null>(null);

  const handleBet = (campaign: Campaign, side: BetSide) => {
    setSelectedCampaign(campaign);
    setSelectedSide(side);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
    setSelectedSide(null);
  };

  const handleConfirmBet = (campaign: Campaign, side: BetSide, amount: number, token: Token) => {
    console.log('Confirmed bet:', { campaign, side, amount, token });
    const newPosition: UserPosition = {
      id: positions.length + 1,
      campaign,
      side,
      amount,
      token,
      status: PositionStatus.Active,
    };
    setPositions(prev => [newPosition, ...prev]);
  };

  const handleClaim = (positionId: number) => {
    setPositions(prevPositions =>
      prevPositions.map(p =>
        p.id === positionId && p.status === PositionStatus.Won
          ? { ...p, isClaimed: true }
          : p
      )
    );
  };

  const renderView = () => {
    switch (view) {
      case View.Discover:
        return <DiscoverView campaigns={campaigns} onBet={handleBet} />;
      case View.Portfolio:
        return <PortfolioView positions={positions} onClaim={handleClaim} />;
      case View.Create:
        return <CreateCampaignView />;
      default:
        return <WelcomeView onEnter={() => setView(View.Discover)} />;
    }
  };

  if (!view) {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <WelcomeView onEnter={() => setView(View.Discover)} />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Header currentView={view} setView={setView} />
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
      <BetModal
        campaign={selectedCampaign}
        side={selectedSide}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBet}
      />
      <footer className="text-center py-4 text-gray-500 text-sm">
        <a
          href="https://warpcast.com/~/channel/zora"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:text-zora-purple transition-colors"
        >
          <FarcasterIcon className="w-4 h-4 mr-2" />
          Built for the Zora channel on Farcaster
        </a>
      </footer>
    </div>
  );
};

export default App;
