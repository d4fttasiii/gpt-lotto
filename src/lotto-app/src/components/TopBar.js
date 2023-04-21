// src/components/TopBar.js
import React from 'react';
import WalletConnector from './WalletConnector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClover } from '@fortawesome/free-solid-svg-icons';

const TopBar = ({ handleMenuToggle }) => {
  return (
    <div className="bg-gray-800 w-full h-16 flex justify-between items-center px-4">
      <div className="flex items-center">
        <button
          className="p-2 text-green-400"
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon icon={faClover} size="lg" />
        </button>
        <span className="text-yellow-600 text-xl font-semibold ml-2">Lucky Shiba</span>
      </div>
      <WalletConnector />
    </div>
  );
};

export default TopBar;
