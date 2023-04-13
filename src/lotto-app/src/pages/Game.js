// src/Game.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import TicketForm from '../components/TicketForm';
import FeatureCard from '../components/FeatureCard';
import { formatUnits } from 'ethers';

const Game = () => {
  const { account, library } = useWeb3React();
  const [ticketPrice, setTicketPrice] = useState('');
  const [round, setRound] = useState('');
  const [ticketCount, setTicketCount] = useState('');

  const lottoContractInstance = getLottoContractInstance(library, account);

  const getTicketPirce = () => {
    return lottoContractInstance.ticketPrice();
  };

  const getRound = () => {
    return lottoContractInstance.roundId();
  };

  const getTicketCount = () => {
    return lottoContractInstance.ticketCount();
  };

  const features = [
    {
      title: 'Current Round',
      description: round,
    },
    {
      title: 'Ticket Price',
      description: ticketPrice + ' MATIC',
    },
    {
      title: 'Number of Tickets',
      description: ticketCount,
    },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      const price = await getTicketPirce();
      setTicketPrice(formatUnits(price, 'ether'));

      const round = await getRound();
      setRound(round.toString());

      const ticketCount = await getTicketCount();
      setTicketCount(ticketCount.toString());
    };

    fetchAll();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-yellow-600">Game</h1>

      <div className="w-full px-4">
        <p className="mb-8 text-xl text-gray-600">By following these steps, you can easily participate in the lottery game and have a chance to win the daily prize.
        </p>

        <h3 className="text-2xl font-semibold mb-4 text-green-400">Steps</h3>
        <ul className="list-disc list-inside ml-4">
          <li className="mb-2">
            <strong>Choose 6 unique numbers:</strong> Users must select 6 unique numbers between 1 and 50. Each number can only be selected once per ticket.
          </li>
          <li className='mb-2'>
            <strong>Buy a Ticket:</strong> Use the following form below to enter your numbers.
          </li>
          <li>
            <strong>Wait for draw:</strong> The winning numbers will be selected at the end of each day. Prizes will be automatically distributed to each winner.
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-8 my-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
      <div className="gap-8 my-8 shadow-md p-4">
        <TicketForm />
      </div>

    </div>
  );
};

export default Game;
