// src/Game.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import TicketForm from '../components/TicketForm';
import LottoTicket from '../components/LottoTicket';
import CountdownToMidnight from '../components/CountdownToMidnight';
import { formatUnits } from 'ethers';

const Game = () => {
  const { account, library } = useWeb3React();
  const [ticketPrice, setTicketPrice] = useState('');
  const [myTickets, setMyTickets] = useState([]);

  useEffect(() => {
    const fetchTicketPrice = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const price = await lottoContractInstance.ticketPrice();
      setTicketPrice(formatUnits(price, 'ether'));
    };
    fetchTicketPrice();
  }, [account, library]);

  useEffect(() => {
    const fetchMyTickets = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const tickets = await lottoContractInstance.getTicketsByAddress(account);
      setMyTickets([...tickets.map(t => t.toString()).filter(t => t)]);
    };
    fetchMyTickets();
  }, [account, library]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className='h-96 mb-8'>
        <h1 className="text-4xl font-bold mb-8 text-yellow-600">Buy your ticket now!</h1>
        <div className="w-full px-4 mb-6">
          <p className="mb-8 text-xl text-gray-600">The ticket price is only <strong>{ticketPrice} MATIC</strong> and you'll receive a Lotto Token for every ticket you buy.
          </p>
        </div>
        <TicketForm />
      </div>

      <div className="h-96 max-w-3xl mx-auto p-6 mb-8">
        <h1 className="text-4xl font-bold mb-8 text-yellow-600">Time until the next draw</h1>
        <CountdownToMidnight />
      </div>

      <div className="h-96 max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-yellow-600">Tickets purchased</h1>
        {
          myTickets.length === 0 ? (
            <p className="mb-8 text-xl text-gray-600">
              The tickets you purchased for this round will be displayed here below.
            </p>
          ) : (
            <div className="flex justify-center mt-6">
              {myTickets.map(ticketId => {
                return (
                  <div className='m-4'>
                    <LottoTicket key={ticketId} ticketId={ticketId}></LottoTicket>
                  </div>
                );
              })}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Game;
