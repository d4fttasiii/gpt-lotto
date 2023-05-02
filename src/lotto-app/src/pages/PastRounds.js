import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { format } from 'date-fns';
import { formatUnits } from 'ethers';

import RoundDetails from '../components/RoundDetails';
import Loading from '../components/Loading';
import NumberSelector from '../components/NumberSelector';
import { getLottoContractInstance } from '../web3/lottoContract';

const PastRounds = () => {
  const { account, library } = useWeb3React();
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedRound, setSelectedRound] = useState(1);
  const [drawnAt, setDrawnAt] = useState('');
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [prizePool, setPrizePool] = useState(0);
  const [winnerGroups, setWinnerGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoundDetails = async (round) => {
    if (!library || !account) return;

    try {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const roundDetails = await lottoContractInstance.getRound(round);
      const roundWinners = await lottoContractInstance.getRoundWinners(round);

      const drawnAtFormatted = format(parseInt(roundDetails[1]) * 1000, 'yyyy-MM-dd HH:mm');
      const prizePoolFormatted = formatUnits(roundDetails[2], "ether").substring(0, 10);
      const winningNumbersFormatted = roundDetails[3].map(n => n.toString());
      const roundWinnersFormatted = [];
      roundWinners.forEach(rw => {
        const x = [];
        rw.forEach(y => {
          x.push(y.toString());
        });
        roundWinnersFormatted.push(x);
      });

      setDrawnAt(drawnAtFormatted);
      setPrizePool(prizePoolFormatted);
      setWinningNumbers(winningNumbersFormatted);
      setWinnerGroups(roundWinnersFormatted);
    } catch (error) {
      console.error('Error fetching round details:', error);
    }
  };

  const goToRound = async (rnd) => {
    setSelectedRound(rnd);
    await fetchRoundDetails(rnd);
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (!library || !account) return;

      setIsLoading(true);
      try {
        const lottoContractInstance = getLottoContractInstance(library, account);
        const round = parseInt(await lottoContractInstance.roundId(), 10);
        setCurrentRound(round);
        await goToRound(round - 1);
      } catch (error) {
        console.error('Error fetching all round details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [account, library]);

  return (
    <div className='h-screen overflow-y-auto'>
      {isLoading ? (<Loading />) : (
        <div className='container mx-auto mb-48'>
          <div className="text-center mt-16 sm:mt-24 animate__animated animate__fadeInDown">
            <h1 className="text-4xl font-bold mb-8 text-yellow-600">Past Rounds</h1>
            <p className="m-8 text-sm sm:text-xl text-white">Here you'll be able to explore the history of previous lottery rounds.
            </p>
          </div>
          <div className='w-80 sm:w-96 mx-auto'>
            <div className="bg-gray-800 flex justify-between items-center mb-6 p-4 animate__animated animate__fadeIn">
              <span className="text-xl font-semibold text-white">
                Active Round
                <span className="shadow-lg rounded-lg bg-gray-600 ml-2 px-2 py-1">
                  {currentRound}
                </span>
              </span>
              <div className="flex">
                <NumberSelector max={currentRound - 1} min={1} value={selectedRound} onChange={(value) => goToRound(value)} />
              </div>
            </div>
            <div className="mb-24">
              {currentRound > 1 ? (
                <RoundDetails
                  roundNumber={selectedRound}
                  drawnAt={drawnAt}
                  prizePool={prizePool}
                  winningNumbers={winningNumbers}
                  winnerGroups={winnerGroups}>
                </RoundDetails>
              ) : (
                <p className="text-xl text-gray-600">
                  The first round of the lottery is active.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastRounds;
