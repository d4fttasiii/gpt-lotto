import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faClock, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import CopyToClipboardText from './CopyToClipboard';

const RoundDetails = ({ roundNumber, drawnAt, prizePool, winningNumbers, winnerGroups }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const handleExpandRow = (index) => {
    const newExpandedRows = [...expandedRows];
    if (newExpandedRows.includes(index)) {
      newExpandedRows.splice(newExpandedRows.indexOf(index), 1);
    } else {
      newExpandedRows.push(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const anyWinners = () => {
    return (winnerGroups || []).flatMap(w => w).length > 0;
  };

  return (
    <div className="shadow-lg bg-gray-600 rounded-lg">
      <div className="text-white text-left font-bold p-4 bg-gray-800 flex justify-between items-center">
        <p className='text-xl'>Round </p>
        <span className='shadow-lg rounded-lg bg-gray-600 px-2 py-1'>{roundNumber}</span>
      </div>

      <div className='text-left text-lg font-bold text-white p-4'>
        <p>
          <FontAwesomeIcon icon={faTrophy} className='mr-2' />
          Prize pool: {prizePool} MATIC
        </p>
        <p>
          <FontAwesomeIcon icon={faClock} className='mr-2' />
          Drawn At: {drawnAt}
        </p>
      </div>

      <div className="grid grid-cols-6 gap-1 sm:gap-2 pb-6 mx-4">
        {winningNumbers.map((number, index) => (
          <div key={`winningNumbers-${index}`} className="bg-yellow-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 text-white font-bold text-center py-2">
            {number}
          </div>
        ))}
      </div>
      {anyWinners() && (
        <table className="table-auto w-full">
          <thead>
            <tr className='bg-gray-800 text-white'>
              <th className="border border-gray-500 px-4 py-2">Matches</th>
              <th className="border border-gray-500 px-4 py-2">Winners</th>
              <th className="border border-gray-500 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {winnerGroups.map((winners, index) => {
              return winners.length > 0 ? (
                <React.Fragment key={`fragMent_winnerGroup-${index}`}>
                  <tr key={`winnerGroup-${index}`}>
                    <td className="border border-gray-500 font-bold text-white text-center px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-500 font-bold text-white text-center px-4 py-2">{winners.length}</td>
                    <td className='border border-gray-500 px-4 py-2 text-center'>
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
                    <tr className="animate__animated animate__flipInX">
                      <td colSpan={3} className="border border-gray-500 text-right">
                        <ul className="list-none space-y-1">
                          {winners.map((winner, i) => (
                            <li key={`winner-${i}`} className="text-white p-2">
                              <CopyToClipboardText maxLength={8} text={winner} />
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ) : (<></>)
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoundDetails;
