import React, { useState } from 'react';

// Fix for window.ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ConnectWalletProps {
  className?: string;
  onConnect?: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ className, onConnect }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setError(null);
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      onConnect?.(); // Call the onConnect callback if provided
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet.');
    }
  };

  // Helper to shorten address
  const shortenAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <>
      {walletAddress ? (
        <span
          className={`inline-flex items-center px-3 py-2 rounded bg-green-100 text-green-800 font-mono text-xs ${className || ''}`}
          title={walletAddress}
        >
          {shortenAddress(walletAddress)}
        </span>
      ) : (
        <button
          onClick={connectWallet}
          className={`btn btn-secondary ${className || ''}`}
          type="button"
        >
          Connect Wallet
        </button>
      )}
      {error && (
        <span className="ml-2 text-xs text-red-500" title={error}>{error}</span>
      )}
    </>
  );
};

export default ConnectWallet; 