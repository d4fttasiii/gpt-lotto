// src/components/TopBar.js
import React from 'react';
import WalletConnector from './WalletConnector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const TopBar = ({ handleMenuToggle }) => {
  return (
    <div className="bg-gray-800 w-full h-16 flex justify-between items-center px-4">
      <button
        className="text-white p-2"
        onClick={handleMenuToggle}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>
      <WalletConnector />
    </div>
  );
};

export default TopBar;