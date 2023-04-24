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
    <div className="container mx-auto px-4 py-8 text-center min-h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-8 text-yellow-600">Past Rounds</h1>
          <div className="w-full px-4 mb-8">
            <p className="mb-8 text-xl text-gray-600">Here you'll be able to explore the history of previous lottery rounds.
            </p>
          </div>
          <div className="bg-gray-800 flex justify-between items-center mb-6 p-4 shadow-lg">
            <span className="text-xl font-semibold text-white">
              Active Round
              <span className="shadow-lg rounded-lg bg-gray-600 ml-2 px-2 py-1">
                {currentRound}
              </span>
            </span>
            <div className="flex">
              <button
                className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-full mr-1"
                onClick={goToPreviousRound}
                disabled={currentRound > selectedRound - 1}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button
                className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-full ml-1"
                onClick={goToNextRound}
                disabled={currentRound <= selectedRound - 1}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
          {currentRound > 1 ? (
            <RoundDetails roundNumber={selectedRound}></RoundDetails>
          ) : (
            <p className="mb-8 text-xl text-gray-600">
              The first round of the lottery is active.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastRounds;
