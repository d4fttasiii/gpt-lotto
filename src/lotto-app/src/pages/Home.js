// src/Home.js
import React from 'react';
import FeatureCard from '../components/FeatureCard';
import logo from '../assets/images/logo.png';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4">
          <h1 className="text-4xl font-bold mb-8 text-yellow-600">About</h1>
          <p className="mb-8 text-xl text-gray-600">
            A decentralized lottery game built on the Polygon blockchain using
            Solidity, OpenZeppelin, and Chainlink VRF for randomness.
          </p>

          <h3 className="text-2xl font-semibold mb-4 text-green-400">Overview</h3>
          <p className="mb-8 text-gray-600">
            The Lotto Game Smart Contract allows users to participate in a lottery
            by purchasing tickets with unique numbers. The contract owner can draw
            the winning numbers using a secure random number generator provided by
            Chainlink VRF. The prizes are distributed among the winners based on
            the number of correct guesses.
          </p>
        </div>
        <div className="w-full md:w-1/2 px-4 flex items-center justify-center">
          <img
            src={logo}
            alt="Lotto Shiba"
            className="w-96 h-96 rounded-full object-cover"
            // className="w-full h-auto max-w-md" // Adjust the max-w-md value as needed
          />
        </div>
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-green-400">Features</h3>
      <div className="grid grid-cols-3 gap-8 mb-8">
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
