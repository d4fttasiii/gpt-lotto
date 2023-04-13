import React from 'react';

const FeatureCard = ({ title, description }) => (
  <div className="bg-white p-4 rounded shadow-md flex-1 flex flex-col h-full">
    <h4 className="text-lg font-semibold mb-2 text-yellow-400">{title}</h4>
    <p className="flex-grow text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;