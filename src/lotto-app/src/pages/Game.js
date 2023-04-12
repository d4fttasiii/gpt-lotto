// src/Game.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import TicketForm from '../components/TicketForm';
import { formatUnits } from 'ethers';

const Game = () => {
  const { account, library } = useWeb3React();
  const [ticketPrice, setData] = useState('');

  const getTicketPirce = () => {
    const lottoContractInstance = getLottoContractInstance(library, account);
    return lottoContractInstance.ticketPrice();
  };

  useEffect(() => {
    getTicketPirce()
      .then((result) => {
        setData(formatUnits(result, 'ether'));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-yellow-600">Game</h1>

      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4">
          <p className="mb-8 text-xl text-gray-600">By following these steps, you can easily participate in the lottery game and have a chance to win the daily prize.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-green-400">Steps</h3>
          <ul className="list-disc list-inside ml-4">
            <li className="mb-2">
              <strong>Choose 6 unique numbers:</strong> Users must select 6 unique numbers between 1 and 50. Each number can only be selected once per ticket.
            </li>
            <li className="mb-2">
              <strong>Ticket price:</strong> {ticketPrice} MATIC
            </li>
            <li>
              <strong>Daily draws:</strong> The winning numbers will be selected at the end of each day. Users can check the results and see if their chosen numbers match the winning numbers.
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 px-4 mt-8 md:mt-0">
          <TicketForm />
        </div>
      </div>
    </div>
  );
};

export default Game;
