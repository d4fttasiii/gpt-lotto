// src/Game.js
import React from 'react';
import TicketForm from '../components/TicketForm';

const Game = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-yellow-600">Game</h1>

      <p className="mb-8 text-xl text-gray-600">By following these steps, you can easily participate in the lottery game and have a chance to win the daily prize.
      </p>

      <h3 className="text-2xl font-semibold mb-4 text-green-400">Steps</h3>
      <ul className="list-disc list-inside ml-4">
        <li className="mb-2">
          <strong>Choose 6 unique numbers:</strong> Users must select 6 unique numbers between 1 and 50. Each number can only be selected once per ticket.
        </li>
        <li className="mb-2">
          <strong>Ticket price:</strong> The current ticket price will be displayed on the interface, which is fetched from the smart contract. Users must send the exact ticket price as the transaction value when purchasing a ticket.
        </li>
        <li className="mb-2">
          <strong>Free Lotto token:</strong> Upon successfully buying a ticket, users will receive a free Lotto token as a bonus. This token will be minted and transferred to the user's address.
        </li>
        <li>
          <strong>Daily draws:</strong> The winning numbers will be selected at the end of each day. Users can check the results and see if their chosen numbers match the winning numbers.
        </li>
      </ul>
      <div className="mt-8">
        <TicketForm />
      </div>
    </div>
  );
};

export default Game;
