// src/Home.js
import React from 'react';

const FeatureCard = ({ title, description }) => (
  <div className="bg-white p-4 rounded shadow-md flex-1 flex flex-col">
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="flex-grow">{description}</p>
  </div>
);

const Home = () => {
  const features = [
    {
      title: 'Secure Random Number Generation',
      description: 'Using Chainlink VRF for secure, on-chain randomness.',
    },
    {
      title: 'Buy Tickets with Unique Numbers',
      description:
        'Users can purchase tickets with 6 unique numbers between 1 and 50.',
    },
    {
      title: 'Prize Distribution',
      description:
        'Prizes are distributed based on the number of correct guesses.',
    },
    {
      title: 'Minting of Lotto Tokens',
      description: 'Lotto tokens are minted for each ticket purchase.',
    },
    {
      title: 'Secure Ownership Management',
      description:
        "Inherits from OpenZeppelin's Ownable contract for secure ownership management.",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">Lotto Game Smart Contract</h1>

      <p className="mb-2">
        A decentralized lottery game built on the Ethereum blockchain using
        Solidity, OpenZeppelin, and Chainlink VRF for randomness.
      </p>

      <h3 className="text-xl font-semibold mb-2">Overview</h3>
      <p className="mb-2">
        The Lotto Game Smart Contract allows users to participate in a lottery
        by purchasing tickets with unique numbers. The contract owner can draw
        the winning numbers using a secure random number generator provided by
        Chainlink VRF. The prizes are distributed among the winners based on
        the number of correct guesses.
      </p>

      <h3 className="text-xl font-semibold mb-4">Features</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
