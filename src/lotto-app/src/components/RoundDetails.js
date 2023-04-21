import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { format } from 'date-fns';
import { formatUnits } from 'ethers';
import { getLottoContractInstance } from '../web3/lottoContract';

const RoundDetails = ({ roundNumber }) => {
  const { account, library } = useWeb3React();
  const [drawnAt, setDrawnAt] = useState('');
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [prizePool, setPrizePool] = useState(0);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchRoundDetails = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const roundDetails = await lottoContractInstance.getRound(roundNumber);
      const roundWinners = await lottoContractInstance.getRoundWinners(roundNumber);

      const drawnAtFormatted = format(parseInt(roundDetails[1]) * 1000, 'yyyy-MM-dd HH:mm');
      const prizePoolFormatted = formatUnits(roundDetails[2], "ether");
      const winningNumbersFormatted = roundDetails[3].map(n => n.toString());
      const roundWinnersFormatted = roundWinners.map(match => match.map(winner => winner.toString()).filter(m => m !== '0'));

      console.log(roundWinnersFormatted);

      setDrawnAt(drawnAtFormatted);
      setPrizePool(prizePoolFormatted);
      setWinningNumbers(winningNumbersFormatted);
      setWinners(roundWinnersFormatted);
    };

    fetchRoundDetails();
  }, [library, account, roundNumber]);

  return (
    <div className="shadow-lg rounded-lg w-96 p-2">
      <div className="text-left font-bold p-4 bg-gray-800">
        <p className='text-white text-xl'>Round <span className='shadow-lg rounded-lg bg-gray-600 px-2 py-1'>{roundNumber}</span></p>
      </div>

      <p className="text-gray-600 mb-2">Drawn at: {drawnAt}</p>

      <div className="grid grid-cols-6 gap-2">
        {winningNumbers.map((number, index) => (
          <div key={index} className="bg-yellow-400 rounded-lg text-white font-bold text-center py-2">
            {number}
          </div>
        ))}
      </div>

      <p className="text-gray-600 mb-2">Prize pool: {prizePool} MATIC</p>

      <table className="table-auto w-full">
        <thead>
          <tr className='bg-gray-600 text-white '>
            <th className="border border-gray-500 px-4 py-2">Number of matches</th>
            <th className="border border-gray-500 px-4 py-2">Winners</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((match, index) =>
            <tr key={index}>
              <td className="border border-gray-500 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-500 px-4 py-2">{match.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoundDetails;
