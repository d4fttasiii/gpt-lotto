// src/Game.js
import React, { useState, useEffect } from 'react';
import { formatUnits } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import { ContractAddresses } from '../web3/contractAddresses';
import TicketForm from '../components/TicketForm';
import CountdownToMidnight from '../components/CountdownToMidnight';
import Loading from '../components/Loading';

const Game = () => {
  const { account, library } = useWeb3React();
  const [ticketPrice, setTicketPrice] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicketPrice = async () => {
      if (library && account) {
        const lottoContractInstance = getLottoContractInstance(library, account);
        const price = await lottoContractInstance.ticketPrice();
        const contractBalance = await library.getBalance(ContractAddresses.LuckyShiba);

        setTicketPrice(formatUnits(price, 'ether'));
        setPrizePool(formatUnits(contractBalance.toString(), 'ether'));
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    fetchTicketPrice();
  }, [account, library]);

  return (
    <div className='h-screen overflow-y-auto'>
      {isLoading ? (<Loading />) : (
        <div className='container mx-auto mb-48'>
          <div className="text-center mt-16 sm:mt-24 animate__animated animate__fadeInDown">
            <h1 className="text-4xl font-bold mb-8 text-yellow-600">Buy your ticket now!</h1>
            
            <p className="m-8 text-sm sm:text-xl text-white">With a ticket price of just <span className='font-bold animate__animated animate__infinite animate__pulse'>{ticketPrice} MATIC</span>, you can jump into the action and seize your chance to win big. For every ticket you purchase, you'll be awarded a Lotto Token, adding even more excitement to the game. The current prize pool stands at a thrilling <span className='font-bold animate__animated animate__infinite animate__pulse'>{prizePool} MATIC</span>, so don't miss out on this incredible opportunity to be a part of the Lucky Shiba Lottery extravaganza! Unleash your luck and fortune today!.
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
