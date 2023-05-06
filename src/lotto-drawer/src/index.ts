// Load the AWS SDK for Node.js
import Web3 from 'web3';
import BN from 'bn.js';
import LuckyShibaConfig from './configuration';
import { LUCKY_SHIBA } from './abis/lucky-shiba';

const config = LuckyShibaConfig();
const web3 = new Web3(config.web3.url);
const luckyShiba = new web3.eth.Contract(
  LUCKY_SHIBA,
  config.contract.luckyShibaAddress,
);

const getTicketNumbers = async (): Promise<number> => {
  const ticketNumbers = await luckyShiba.methods.getTicketCount().call();
  return parseInt(ticketNumbers, 10);
};

const getRandomResult = async (): Promise<BN> => {
  const randomResult = await luckyShiba.methods.randomResult().call();
  return new BN(randomResult);
};

const drawWinningNumbers = async () => {
  const encodedABI = luckyShiba.methods.drawWinningNumbers().encodeABI();
  const tx = {
    from: config.contract.applicationAddress,
    to: config.contract.luckyShibaAddress,
    gas: 500000,
    data: encodedABI,
  };

  const gas = await web3.eth.estimateGas(tx);
  tx.gas = gas;

  const signedTx = await web3.eth.accounts.signTransaction(
    tx,
    config.contract.applicationPrivateKey,
  );

  const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log(`Winning numbers have been drawn `, result.transactionHash);
};

const distributePrizes = async () => {
  const encodedABI = luckyShiba.methods.distributePrizes().encodeABI();
  const tx = {
    from: config.contract.applicationAddress,
    to: config.contract.luckyShibaAddress,
    gas: 1000000,
    data: encodedABI,
  };

  const gas = await web3.eth.estimateGas(tx);
  tx.gas = gas;

  const signedTx = await web3.eth.accounts.signTransaction(
    tx,
    config.contract.applicationPrivateKey,
  );

  const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log(`Winning numbers have been drawn `, result.transactionHash);
};

const waitForRandomness = async () => {

  console.log(`Waiting for randomResult to arrive...`);

  return new Promise<void>((resolve) => {
    const checkForRandomResult = async () => {
      const randomResult = await getRandomResult();

      if (randomResult > new BN(0)) {
        console.log(`RandomResult arrived: ${randomResult.toString()}!`);
        resolve();
      } else {
        setTimeout(checkForRandomResult, 15000); // Check every 15 seconds.
      }
    };

    checkForRandomResult();
  });
};

// Handler function
export const handler = async (event: any, context: any): Promise<any> => {
  try {
    const ticketNumbers = await getTicketNumbers();

    if (ticketNumbers === 0) {
      console.warn();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Skipped drawing winning numbers',
        }),
      };
    }

    await drawWinningNumbers();
    await waitForRandomness();
    await distributePrizes();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Succesfully drawn winning numbers',
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error while drawing winning numbers',
        error,
      }),
    };
  }
};
