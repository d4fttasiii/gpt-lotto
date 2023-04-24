import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { format } from 'date-fns';
import { formatUnits } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { faTrophy, faClock, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { formatAddress } from '../utils/formatAddress';
import { getLottoContractInstance } from '../web3/lottoContract';
import './animationStyles.css';

const RoundDetails = ({ roundNumber }) => {
  const { account, library } = useWeb3React();
  const [drawnAt, setDrawnAt] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [prizePool, setPrizePool] = useState(0);
  const [winnerGroups, setWinners] = useState([]);

  useEffect(() => {
    const fetchRoundDetails = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const roundDetails = await lottoContractInstance.getRound(roundNumber);
      const roundWinners = await lottoContractInstance.getRoundWinners(roundNumber);

      const drawnAtFormatted = format(parseInt(roundDetails[1]) * 1000, 'yyyy-MM-dd HH:mm');
      const prizePoolFormatted = formatUnits(roundDetails[2], "ether");
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
      setWinners(roundWinnersFormatted);
    };

    fetchRoundDetails();
  }, [library, account, roundNumber]);

  const handleExpandRow = (index) => {
    const newExpandedRows = [...expandedRows];
    if (newExpandedRows.includes(index)) {
      newExpandedRows.splice(newExpandedRows.indexOf(index), 1);
    } else {
      newExpandedRows.push(index);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="shadow-lg rounded-lg w-96">
      <div className="text-left font-bold p-4 bg-gray-800">
        <p className='text-white text-xl'>Round <span className='shadow-lg rounded-lg bg-gray-600 px-2 py-1'>{roundNumber}</span></p>
      </div>

      <div className='text-left text-lg font-bold text-gray-600 p-4'>
        <p>
          <FontAwesomeIcon icon={faTrophy} className='mr-2' />
          Prize pool: {prizePool} MATIC
        </p>
        <p>
          <FontAwesomeIcon icon={faClock} className='mr-2' />
          Drawn At: {drawnAt}
        </p>
      </div>

      <div className="grid grid-cols-6 mb-6 mt-2 mx-2 gap-2">
        {winningNumbers.map((number, index) => (
          <div key={index} className="bg-yellow-400 rounded-lg text-white font-bold text-center py-2">
            {number}
          </div>
        ))}
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr className='bg-gray-600 text-white'>
            <th className="border border-gray-500 px-4 py-2">Matches</th>
            <th className="border border-gray-500 px-4 py-2">Winners</th>
            <th className="border border-gray-500 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <TransitionGroup component={null}>
            {winnerGroups.map((winners, index) =>
              <React.Fragment key={index}>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-500 px-4 py-2">{winners.length}</td>
                  <td>
                    <button
                      className={(winners.length === 0 ? 'text-gray-400' : 'text-green-600')}
                      onClick={() => handleExpandRow(index)}
                      disabled={winners.length === 0}
                    >
                      <FontAwesomeIcon icon={faAngleDown} className={expandedRows.includes(index) ? 'fa-rotate-180' : ''}></FontAwesomeIcon>
                    </button>
                  </td>
                </tr>
                {expandedRows.includes(index) && (
                  <CSSTransition
                    in={expandedRows.includes(index)}
                    timeout={600}
                    classNames="expandable-row"
                    unmountOnExit
                  >
                    <tr>
                      <td colSpan={3} className="border-t text-right">
                        <ul className="list-none space-y-1">
                          {winners.map((winner, i) => (
                            <li key={i} className="p-2">
                              {formatAddress(winner)}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </CSSTransition>
                )}
              </React.Fragment>
            )}
          </TransitionGroup>
        </tbody>
      </table>
    </div>
  );
};

export default RoundDetails;
