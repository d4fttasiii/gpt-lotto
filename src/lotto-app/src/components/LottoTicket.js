// src/components/LottoTicket.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import './Spinner.css';

const LottoTicket = ({ ticketId }) => {
  const { account, library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    const fetchNumbers = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const numbers = await lottoContractInstance.getTicketNumbers(parseInt(ticketId, 10));
      setNumbers(numbers.map(n => n.toString()));
      setLoading(false);
    };

    fetchNumbers();
  }, [library, account, ticketId]);

  return (
    <div className="shadow-lg rounded-lg w-80 sm:w-96">
      <div className="text-left font-bold p-4 bg-gray-800 flex justify-between items-center">
        <p className='text-white text-xl'>Ticket Number</p>
        <span className='shadow-lg rounded-lg bg-gray-600 px-2 py-1'>{ticketId}</span>
      </div>

      <div className="bg-gray-300 p-4">
        {loading ? (
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {numbers.map((number, index) => (
              <div key={index} className="bg-yellow-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 text-white font-bold text-center py-2">
                {number}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LottoTicket;
