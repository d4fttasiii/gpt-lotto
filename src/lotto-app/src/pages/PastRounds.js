import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getLottoContractInstance } from '../web3/lottoContract';

const PastRounds = () => {
  const { account, library } = useWeb3React();
  const [round, setRound] = useState('');
  const lottoContractInstance = getLottoContractInstance(library, account);

  const getRound = (index) => {
    return lottoContractInstance.rounds(index);
  };

  useEffect(() => {
    const fetchAll = async () => {
      const round = parseInt(await lottoContractInstance.roundId(), 10);
      setRound(round.toString());
    };
    
    fetchAll();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-yellow-600">Past Rounds</h1>
      {round}
      {/* Add your previous games content here */}
    </div>
  );
};

export default PastRounds;
