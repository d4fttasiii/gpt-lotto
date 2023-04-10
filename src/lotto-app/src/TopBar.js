// src/TopBar.js
import React from 'react';
import WalletConnector from './WalletConnector';

const TopBar = () => {
  return (
    <div className="w-full h-14 bg-gray-600 text-white flex items-center justify-between px-4">
      <h2 className="text-2xl font-semibold"></h2>
      <WalletConnector />
    </div>
  );
};

export default TopBar;
