// src/components/TopBar.js
import React from 'react';
import WalletConnector from './WalletConnector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClover } from '@fortawesome/free-solid-svg-icons';

const TopBar = ({ handleMenuToggle }) => {
  return (
    <div className="bg-gray-800 w-full h-16 flex justify-between items-center px-4 fixed top-0 z-20">
      <div className="flex items-center">
        <button
          className="p-2 text-green-400"
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon icon={faClover} size="lg" />
        </button>
      </div>
      <WalletConnector hasNetworkBtn={true} />
    </div>
  );
};

export default TopBar;

