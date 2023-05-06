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
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  const networks = [
    { id: 80001, name: 'Polygon Testnet', chainId: 80001 },
  ];

  useEffect(() => {
    const connectMetaMask = async () => {
      const detectedProvider = await detectEthereumProvider();
      if (detectedProvider) {
        setIsMetaMaskInstalled(true);
        try {
          await activate(injectedProvider);
          const currentChainId = parseInt(detectedProvider.chainId, 16);
          const targetNetwork = networks.find((network) => network.chainId === currentChainId);
          if (!targetNetwork) {
            await switchNetwork(networks[0].chainId);
          }
        } catch (error) {
          console.error('Failed to connect MetaMask:', error);
        }
      } else {
        setIsMetaMaskInstalled(false);
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
      const provider = await injectedProvider.getProvider();
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${newChainId.toString(16)}` }],
      });
    } catch (switchError) {
      console.error('Failed to switch network:', switchError);
      if (switchError.code === 4902) { // Chain not found
        await addNetwork(newChainId);
      }
    }
  };

  const addNetwork = async (newChainId) => {
    const targetNetwork = networks.find((network) => network.chainId === newChainId);
    if (!targetNetwork) return;

    const provider = await injectedProvider.getProvider();
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${targetNetwork.chainId.toString(16)}`,
            chainName: targetNetwork.name,
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
          },
        ],
      });
    } catch (addError) {
      console.error('Failed to add network:', addError);
    }
  };

  return (
    <div className="relative">
      {(active && hasNetworkBtn && isMetaMaskInstalled) && (
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
            <div className="absolute mt-2 bg-gray-800 shadow-lg rounded p-2 animate__animated animate__flipInX">
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
      {!isMetaMaskInstalled ? (
        <button className={`ml-2 bg-red-500 text-white font-bold ${isBig ? 'py-4 px-6 rounded-xl' : 'px-4 py-2 rounded'}`}
          disabled={true}>
          No wallet provider detected
        </button>
      ) : (
        <button
          className={`ml-2 ${active ? 'bg-green-500' : 'bg-gray-700'
            } text-white font-bold ${isBig ? 'py-4 px-6 rounded-xl' : 'px-4 py-2 rounded'}`}
          onClick={() => handleClick()}
          disabled={!isMetaMaskInstalled}
        >
          <FontAwesomeIcon icon={faWallet} />
          <span className='ml-2'>{active ? formatAddress(account) : 'Connect Wallet'}</span>
        </button>
      )}
    </div >
  );
};

export default WalletConnector;