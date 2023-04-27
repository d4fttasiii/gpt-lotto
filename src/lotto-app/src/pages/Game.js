// src/Game.js
import React, { useState, useEffect } from 'react';
import { formatUnits } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import TicketForm from '../components/TicketForm';
import CountdownToMidnight from '../components/CountdownToMidnight';
import Loading from '../components/Loading';

const Game = () => {
  const { account, library } = useWeb3React();
  const [ticketPrice, setTicketPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicketPrice = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const price = await lottoContractInstance.ticketPrice();
      setTicketPrice(formatUnits(price, 'ether'));
      setTimeout(() => setIsLoading(false), 1000);
    };
    fetchTicketPrice();
  }, [account, library]);

  return (
    <div className='h-screen overflow-y-auto'>
      {isLoading ? (<Loading />) : (
        <div className='container mx-auto mb-48'>
          <div className="text-center mt-16 sm:mt-24 animate__animated animate__fadeInDown">
            <h1 className="text-4xl font-bold mb-8 text-yellow-600">Buy your ticket now!</h1>
            <p className="m-8 text-sm sm:text-xl text-white">The ticket price is only <strong>{ticketPrice} MATIC</strong> and you'll receive a Lotto Token for every ticket you buy.
            </p>
          </div>

          <div className='my-8 animate__animated animate__fadeIn'>
            <TicketForm />
          </div>

          <div className="text-center mb-8 animate__animated animate__fadeInUp">
            <h2 className="text-2xl mb-4 font-bold text-yellow-500">Time until the next draw</h2>
          </div>

          <div className='flex justify-center animate__animated animate__fadeInUp w-full'>
            <div className='text-center w-80 sm:w-96'>
              <CountdownToMidnight />
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Game;
