import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from '../constants';

interface ZoraAssetMetadata {
  name?: string;
  symbol?: string;
  image?: string;
  type?: string;
  address?: string;
  contractAddress?: string;
  minter?: string;
  owner?: string;
}

export const CreateCampaignView: React.FC = () => {
  // ✅ Removed unused `address`
  const { isConnected } = useAccount();
  const [zoraLink, setZoraLink] = useState('');
  const [duration, setDuration] = useState(86400);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ZoraAssetMetadata | null>(null);
  const [creatorAddress, setCreatorAddress] = useState<`0x${string}` | null>(null);

  const {
    data: hash,
    writeContract,
    isPending: isSubmitting,
    error: contractError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (contractError) {
      setError(`Contract Error: ${contractError.message}`);
    }
  }, [contractError]);

  const isValidZoraLink = (url: string) => {
    const pattern = /^https:\/\/zora\.co\/(collect|coin)\/[a-zA-Z0-9:\/.-]+/;
    return pattern.test(url);
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMeta(null);
    setCreatorAddress(null);

    const trimmedLink = zoraLink.trim();
    if (!isValidZoraLink(trimmedLink)) {
      setError("Please enter a valid Zora.co link (e.g., https://zora.co/collect/... or https://zora.co/coin/...)");
      return;
    }

    try {
      setIsFetching(true);
      const parts = new URL(trimmedLink).pathname.split('/');
      const type = parts[1];

      let apiUrl = '';
      if (type === 'coin') {
        const [chain, addr] = parts[2].split(':');
        apiUrl = `https://api.zora.co/coins/${chain}/${addr}`;
      } else if (type === 'collect') {
        const [chain, contractAddress] = parts[2].split(':');
        const tokenId = parts[3];
        apiUrl = `https://api.zora.co/collect/${chain}/${contractAddress}/${tokenId}`;
      }

      if (!apiUrl) throw new Error('Could not parse the Zora link.');

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Invalid or unsupported Zora asset. Status: ${res.status}`);

      const data: ZoraAssetMetadata = await res.json();
      const fetchedCreatorAddress = data.minter || data.owner;

      if (!fetchedCreatorAddress || !fetchedCreatorAddress.startsWith('0x')) {
        throw new Error("Could not automatically determine the creator's wallet address from the link.");
      }

      setMeta(data);
      setCreatorAddress(fetchedCreatorAddress as `0x${string}`);
    } catch (err: any) {
      console.error(err);
      setError(`Could not fetch metadata. ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorAddress || !zoraLink) return;

    writeContract({
      address: CAMPAIGN_FACTORY_ADDRESS,
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: 'createCampaign',
      args: [zoraLink, creatorAddress, BigInt(duration)],
    });
  };

  const resetForm = () => {
    setZoraLink('');
    setMeta(null);
    setError(null);
    setCreatorAddress(null);
    setDuration(86400);
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in bg-gray-800 p-8 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">Please connect your wallet to create a new campaign.</p>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4 text-green-400">Campaign Created!</h2>
        <p className="text-gray-300 mb-2">Your campaign contract has been deployed successfully.</p>
        <p className="text-gray-400 text-sm mb-8 break-all">Transaction Hash: {hash}</p>
        <button
          onClick={resetForm}
          className="bg-zora-blue text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all"
        >
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-2">Create a New Campaign</h2>
      <p className="text-gray-400 mb-8">
        Enter a Zora NFT or Creator Coin link to fetch its metadata and create a hype campaign.
      </p>

      {/* Step 1: Fetch Zora asset */}
      <form onSubmit={handleFetch} className="space-y-4 bg-gray-800 p-6 md:p-8 rounded-lg border border-gray-700">
        <div>
          <label htmlFor="zoraLink" className="block text-sm font-medium text-gray-300 mb-2">
            Zora.co Link
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              id="zoraLink"
              value={zoraLink}
              onChange={(e) => setZoraLink(e.target.value)}
              placeholder="https://zora.co/collect/... or /coin/..."
              className="flex-grow bg-gray-900 border rounded-md p-3 text-white focus:ring-zora-blue focus:border-zora-blue transition border-gray-600"
            />
            <button
              type="submit"
              disabled={isFetching || !zoraLink}
              className="bg-zora-blue text-white font-bold py-3 px-5 rounded-md hover:bg-opacity-80 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isFetching ? 'Fetching...' : 'Fetch & Preview'}
            </button>
          </div>
          {error && !isSubmitting && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      </form>

      {/* Step 2: Display preview + deploy form */}
      {meta && creatorAddress && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 bg-gray-800 p-6 md:p-8 rounded-lg border border-gray-700 animate-fade-in"
        >
          <h3 className="text-xl font-bold text-center mb-4">Campaign Preview & Configuration</h3>

          <div className="bg-gray-900/50 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-5 border border-gray-700">
            {meta.image && (
              <img
                src={meta.image}
                alt={meta.name || 'Asset Image'}
                className="w-24 h-24 rounded-md object-cover flex-shrink-0"
              />
            )}
            <div>
              <p className="text-lg font-bold">{meta.name || meta.symbol || 'Unknown Asset'}</p>
              <p className="text-xs text-gray-400 mt-1 break-all">
                <strong>Creator:</strong> {creatorAddress}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Duration</label>
            <div className="flex space-x-4">
              {[
                { label: '24 Hours', value: 86400 },
                { label: '7 Days', value: 604800 },
              ].map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    duration === d.value
                      ? 'bg-zora-blue text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || isConfirming}
              className="w-full bg-zora-purple text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-80 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? 'Check Wallet...' : isConfirming ? 'Deploying...' : 'Deploy Campaign'}
            </button>
          </div>

          {hash && <p className="text-center text-xs text-gray-400 break-all">Tx sent: {hash}</p>}
          {error && isSubmitting && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};
