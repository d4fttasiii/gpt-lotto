// components/TicketForm.js
import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import { useSnackBar } from '../contexts/SnackBarContext';

const TicketForm = () => {
  const { showSnackBar } = useSnackBar();
  const { account, library } = useWeb3React();
  const [numbers, setNumbers] = useState(Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');

  const handleNumberChange = (e, index) => {
    const newNumbers = [...numbers];
    newNumbers[index] = parseInt(e.target.value);
    setNumbers(newNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uniqueNumbers = [...new Set(numbers.map(Number))];

    if (uniqueNumbers.length !== 6) {
      setErrorMessage('Please enter 6 unique numbers.');
      return;
    }

    for (const number of uniqueNumbers) {
      if (number < 1 || number > 50) {
        setErrorMessage('All numbers should be between 1 and 50.');
        return;
      }
    }

    setErrorMessage('');
    showSnackBar('asdasd', 'success');
    // Call your web3 function to purchase the ticket here.

    try {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const ticketPrice = await lottoContractInstance.methods.ticketPrice().call();
      await lottoContractInstance.methods
        .buyTicket(uniqueNumbers)
        .send({ from: account, value: ticketPrice });

      console.log('Ticket purchased successfully');
    } catch (error) {
      setErrorMessage('Error purchasing ticket: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex">
        {numbers.map((number, index) => (
          <input
            key={index}
            type="number"
            value={number}
            onChange={(e) => handleNumberChange(e, index)}
            min="1"
            max="50"
            required
            className="w-14 mx-1 border-2 border-gray-300 rounded-md px-2 py-1"
          />
        ))}
        <button
          type="submit"
          className={"ml-4 text-white font-bold py-1 px-4 rounded " + (account ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-600')}
          disabled={!account}
        >
          Buy Ticket
        </button>
      </form>
      {errorMessage && (
        <p className="mt-2 text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default TicketForm;
