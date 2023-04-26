// src/components/WalletConnector.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injectedProvider } from '../web3/web3';
import { formatAddress } from '../utils/formatAddress';
import detectEthereumProvider from '@metamask/detect-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faShareNodes } from '@fortawesome/free-solid-svg-icons';

const WalletConnector = ({ isBig, hasNetworkBtn }) => {
  const { activate, deactivate, active, account, chainId } = useWeb3React();
  const [showNetworks, setShowNetworks] = useState(false);

  const networks = [
    { id: 80001, name: 'Polygon Testnet', chainId: 80001 },
  ];

  useEffect(() => {
    const connectMetaMask = async () => {
      const detectedProvider = await detectEthereumProvider();
      if (detectedProvider) {
        try {
          await activate(injectedProvider);
        } catch (error) {
          console.error('Failed to connect MetaMask:', error);
        }
      } else {
        console.warn('No Ethereum provider detected.');
      }
    };

    connectMetaMask();
  }, [activate]);

  const handleClick = () => {
    if (active) {
      deactivate();
    } else {
      activate(injectedProvider);
    }
  };

  const switchNetwork = async (newChainId) => {
    try {
      await injectedProvider.getProvider().request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${newChainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return (
    <div className="relative">
      {(active && hasNetworkBtn) && (
        <>
          <button
            className="bg-gray-600 text-white font-bold px-4 py-2 rounded"
            onClick={() => setShowNetworks(!showNetworks)}
          >
            <span className='sm:hidden'><FontAwesomeIcon icon={faShareNodes} /></span>
            <span className='hidden sm:block sm:ml-2'>
              {networks.find((network) => network.chainId === chainId)?.name}
            </span>
          </button>
          {showNetworks && (
            <div className="absolute mt-2 bg-gray-800 shadow-lg rounded p-2 animate__animated animate__fadeInDown">
              {networks.map((network) => (
                <button
                  key={network.id}
                  className="block w-full text-white text-left px-2 py-1 hover:bg-gray-200 hover:text-black"
                  onClick={() => switchNetwork(network.chainId)}
                >
                  {network.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <button
        className={`ml-2 ${active ? 'bg-green-500' : 'bg-gray-700'
          } text-white font-bold ${isBig ? 'py-4 px-6 rounded-xl' : 'px-4 py-2 rounded'}`}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faWallet} />
        <span className='ml-2'>{active ? formatAddress(account) : 'Connect Wallet'}</span>
      </button>
    </div >
  );
};

export default WalletConnector;
