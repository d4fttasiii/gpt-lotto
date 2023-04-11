// src/components/BuyTicket.js
import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';

const BuyTicket = () => {
  const { account, library } = useWeb3React();
  const [numbers, setNumbers] = useState(Array(6).fill(''));

  const handleChange = (event, index) => {
    const newNumbers = [...numbers];
    newNumbers[index] = parseInt(event.target.value);
    setNumbers(newNumbers);
  };

  const buyTicket = async (numbers) => {
    if (!account) {
      console.error('No connected account found');
      return;
    }

    try {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const ticketPrice = await lottoContractInstance.methods.ticketPrice().call();
      await lottoContractInstance.methods
        .buyTicket(numbers)
        .send({ from: account, value: ticketPrice });

      console.log('Ticket purchased successfully');
    } catch (error) {
      console.error('Error purchasing ticket:', error);
    }
  };

  const handleBuyTicket = () => {
    buyTicket(numbers);
  };

  const renderInputs = () => {
    return numbers.map((number, index) => (
      <input
        key={index}
        type="number"
        value={number}
        min="1"
        max="50"
        onChange={(event) => handleChange(event, index)}
      />
    ));
  };

  return (
    <div>
      {renderInputs()}
      <button onClick={handleBuyTicket} disabled={!account} className='bg-gray-600 text-white px-4 py-2 rounded'>
        Buy Ticket
      </button>
    </div>
  );
};

export default BuyTicket;
