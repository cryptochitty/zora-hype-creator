import React from 'react';
import { UserPosition, BetSide, PositionStatus } from '../types';

interface PortfolioViewProps {
  positions: UserPosition[];
  onClaim: (positionId: number) => void;
}

const getStatusClasses = (status: PositionStatus) => {
    switch (status) {
        case PositionStatus.Active:
            return 'bg-blue-500/20 text-blue-300';
        case PositionStatus.Won:
            return 'bg-green-500/20 text-green-300';
        case PositionStatus.Lost:
            return 'bg-red-500/20 text-red-300';
        default:
            return 'bg-gray-500/20 text-gray-300';
    }
}

const getSideClasses = (side: BetSide) => {
    return side === BetSide.Supporter ? 'text-supporter-green' : 'text-hatter-red';
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ positions, onClaim }) => {
    const activePositions = positions.filter(p => p.status === PositionStatus.Active);
    const pastPositions = positions.filter(p => p.status !== PositionStatus.Active);

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">My Portfolio</h2>
            <p className="text-gray-400 mb-8">Track your active positions and review your history.</p>
            
            <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Active Positions</h3>
                {activePositions.length > 0 ? (
                    <div className="space-y-4">
                        {activePositions.map(pos => (
                             <div key={pos.id} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-700">
                                <div className="flex items-center mb-3 sm:mb-0">
                                    <img src={pos.campaign.nftImage} alt={pos.campaign.tokenName} className="w-12 h-12 rounded-md mr-4 object-cover" />
                                    <div>
                                        <p className="font-bold text-white">{pos.campaign.tokenName}</p>
                                        <p className={`text-sm font-semibold ${getSideClasses(pos.side)}`}>
                                            {pos.side}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{pos.amount.toLocaleString()} {pos.token}</p>
                                    <p className="text-xs text-gray-400">Locked Amount</p>
                                </div>
                             </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500">You have no active positions.</p>}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Past Positions</h3>
                {pastPositions.length > 0 ? (
                    <div className="space-y-4">
                        {pastPositions.map(pos => {
                            let netReturnDisplay = '';
                            let netReturnText = '';

                            if (pos.status === PositionStatus.Won) {
                                const { campaign, side, amount } = pos;
                                const isSupporterWinner = side === BetSide.Supporter;
                                const winningPool = isSupporterWinner ? campaign.supporterPool : campaign.hatterPool;
                                const losingPool = isSupporterWinner ? campaign.hatterPool : campaign.supporterPool;
                                let netReturn = 0;

                                if (winningPool > 0) {
                                    const winnersShare = losingPool * 0.90;
                                    const userProportion = amount / winningPool;
                                    netReturn = userProportion * winnersShare;
                                }
                                netReturnDisplay = `+${netReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                netReturnText = 'Net Return';
                            } else {
                                netReturnDisplay = `-${pos.amount.toLocaleString()}`;
                                netReturnText = 'Amount Lost';
                            }

                            return (
                                <div key={pos.id} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-700">
                                    <div className="flex items-center mb-3 sm:mb-0">
                                        <img src={pos.campaign.nftImage} alt={pos.campaign.tokenName} className="w-12 h-12 rounded-md mr-4 object-cover" />
                                        <div>
                                            <p className="font-bold text-white">{pos.campaign.tokenName}</p>
                                            <p className={`text-sm font-semibold ${getSideClasses(pos.side)}`}>
                                                {pos.side}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${pos.status === PositionStatus.Won ? 'text-green-400' : 'text-red-400'}`}>
                                                {netReturnDisplay} {pos.token}
                                            </p>
                                            <p className="text-xs text-gray-400">{netReturnText}</p>
                                        </div>
                                        <div className="w-24 text-center">
                                            {pos.status === PositionStatus.Won ? (
                                                pos.isClaimed ? (
                                                    <button disabled className="w-full bg-gray-600 text-gray-400 font-bold py-2 px-3 rounded-md text-sm cursor-not-allowed">
                                                        Claimed
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => onClaim(pos.id)}
                                                        className="w-full bg-zora-purple text-white font-bold py-2 px-3 rounded-md hover:bg-opacity-80 transition-all text-sm"
                                                    >
                                                        Claim
                                                    </button>
                                                )
                                            ) : (
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(pos.status)}`}>
                                                    {pos.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : <p className="text-gray-500">You have no past positions.</p>}
            </div>
        </div>
    );
};