// src/components/WalletConnector.js
import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../web3/lottoContract';
import { formatAddress } from '../utils/formatAddress';

const WalletConnector = () => {
    const { activate, deactivate, active, account, chainId } = useWeb3React();
    const [showNetworks, setShowNetworks] = useState(false);

    const networks = [
        { id: 137, name: 'Polygon Mainnet', chainId: 137 },
        { id: 1337, name: 'Local', chainId: 1337 },
    ];

    const handleClick = () => {
        if (active) {
            deactivate();
        } else {
            activate(injectedConnector);
        }
    };

    const switchNetwork = async (newChainId) => {
        try {
            await injectedConnector.getProvider().request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${newChainId.toString(16)}` }],
            });
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    };

    return (
        <div className="relative">
            {active && (
                <>
                    <button
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                        onClick={() => setShowNetworks(!showNetworks)}
                    >
                        {networks.find((network) => network.chainId === chainId)?.name}
                    </button>
                    {showNetworks && (
                        <div className="absolute mt-2 bg-gray-800 shadow-lg rounded p-2">
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
            )}<button
                className={`ml-2 ${active ? 'bg-green-600' : 'bg-gray-600'
                    } text-white px-4 py-2 rounded`}
                onClick={handleClick}
            >
                {active ? formatAddress(account) : 'Connect Wallet'}
            </button>
        </div>
    );
};

export default WalletConnector;
