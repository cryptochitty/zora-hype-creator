export enum View {
  Discover = 'DISCOVER',
  Portfolio = 'PORTFOLIO',
  Create = 'CREATE',
}

export enum BetSide {
  Supporter = 'SUPPORTER',
  Hatter = 'HATTER',
}

export enum Token {
  ZORA = 'ZORA',
  ETH = 'ETH',
  USDC = 'USDC',
}

export interface Campaign {
  id: number;
  creator: string;
  creatorAddress?: string;
  contractAddress?: string; 
  creatorAvatar: string;
  tokenName: string;
  nftImage: string;
  zoraLink: string;
  supporterPool: number;
  hatterPool: number;
  endDate: Date;
  network: 'Base' | 'Celo' | 'Common';
}

export enum PositionStatus {
  Active = 'ACTIVE',
  Won = 'WON',
  Lost = 'LOST',
}

export interface UserPosition {
  id: number;
  campaign: Campaign;
  side: BetSide;
  amount: number;
  token: Token;
  status: PositionStatus;
  payout?: number;
  isClaimed?: boolean;
}