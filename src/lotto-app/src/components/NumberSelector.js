// src/components/NumberSelector.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

const NumberSelector = ({ min, max, value, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value || min);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentValue(value || min);
  }, [value, min]);

  const handleSelection = (newValue) => {
    setCurrentValue(newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='mr-2'>{currentValue}</span>
        <FontAwesomeIcon icon={faCaretDown} ></FontAwesomeIcon>
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white shadow-lg rounded border border-gray-300 animate__animated animate__flipInX">
          <div className="divide-y divide-gray-300">
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((number) => (
              <button
                key={number}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                onClick={() => handleSelection(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberSelector;
