// src/MyTickets.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { getLottoContractInstance } from '../web3/lottoContract';
import LottoTicket from '../components/LottoTicket';
import Loading from '../components/Loading';

const MyTickets = () => {
  const { account, library } = useWeb3React();
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const tickets = await lottoContractInstance.getTicketsByAddress(account);
      setMyTickets([...tickets.map(t => t.toString()).filter(t => t)]);
      setTimeout(() => setIsLoading(false), 1000);
    };
    fetchMyTickets();
  }, [account, library]);

  return (
    <div className='h-screen overflow-y-auto'>
      {isLoading ? (<Loading />) : (
        <div className='container mx-auto mb-48'>
          <div className="text-center mt-16 sm:mt-24 animate__animated animate__fadeInDown">
            <h1 className="text-4xl font-bold mb-8 text-yellow-600">My Tickets</h1>
          </div>
          {myTickets.length === 0 ? (
            <p className="my-8 text-xl text-gray-600">
              The tickets you purchased for this round will be displayed here below.
            </p>
          ) : (
            <div className='flex justify-center w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 gap-2'>
                {myTickets.map((ticketId) => {
                  return (
                    <div className='my-4 mx-auto sm:mx-4 animate__animated animate__flipInX'>
                      <LottoTicket key={ticketId} ticketId={ticketId}></LottoTicket>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div >
  );
};

export default MyTickets;
