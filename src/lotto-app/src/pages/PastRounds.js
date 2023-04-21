import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getLottoContractInstance } from '../web3/lottoContract';
import RoundDetails from '../components/RoundDetails';

const PastRounds = () => {
  const { account, library } = useWeb3React();
  const [currentRound, setCurrentRound] = useState('');
  const [selectedRound, setSelectedRound] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const round = parseInt(await lottoContractInstance.roundId(), 10);
      setCurrentRound(round);
      setSelectedRound(round - 1);
    };

    fetchAll();
  }, [account, library]);

  const goToPreviousRound = () => {
    if (selectedRound > 1) {
      setSelectedRound(selectedRound - 1);
    }
  };

  const goToNextRound = () => {
    if (selectedRound < currentRound - 1) {
      setSelectedRound(selectedRound + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className='mb-8'>
        <h1 className="text-4xl font-bold mb-8 text-yellow-600">Past Rounds</h1>
        <div className="w-full px-4 mb-6">
          <p className="mb-8 text-xl text-gray-600">
          </p>
        </div>
        <div className="bg-gray-800 flex justify-between items-center mb-6 p-4 shadow-lg">
          <span className="text-xl font-semibold text-gray-300">
            Active Round:
            <span className="shadow-lg rounded-lg bg-gray-600 px-2 py-1">
              {currentRound}
            </span>
          </span>
          <div className="flex">
            <button
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full mr-4"
              onClick={goToPreviousRound}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full ml-4"
              onClick={goToNextRound}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        <RoundDetails roundNumber={selectedRound}></RoundDetails>
      </div>
    </div>
  );
};

export default PastRounds;
