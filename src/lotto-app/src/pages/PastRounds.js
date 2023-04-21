import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';
import RoundDetails from '../components/RoundDetails';

const PastRounds = () => {
  const { account, library } = useWeb3React();
  const [round, setRound] = useState('');


  useEffect(() => {
    const fetchAll = async () => {
      const lottoContractInstance = getLottoContractInstance(library, account);
      const round = parseInt(await lottoContractInstance.roundId(), 10);
      setRound(round.toString());
    };

    fetchAll();
  }, [account, library]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className='mb-8'>
        <h1 className="text-4xl font-bold mb-8 text-yellow-600">Past Rounds</h1>
        <div className="w-full px-4 mb-6">
          <p className="mb-8 text-xl text-gray-600">
          </p>
        </div>
        <RoundDetails roundNumber={round - 1}></RoundDetails>
      </div>
    </div>
  );
};

export default PastRounds;
