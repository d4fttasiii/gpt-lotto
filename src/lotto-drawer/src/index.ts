// Load the AWS SDK for Node.js
import Web3 from 'web3';
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

const waitForBlocks = async (n: number) => {
  const initialBlockNumber = await web3.eth.getBlockNumber();
  const targetBlockNumber = initialBlockNumber + n;

  console.log(`Initial block number: ${initialBlockNumber}`);
  console.log(`Waiting for ${n} blocks...`);

  return new Promise<void>((resolve) => {
    const checkForNewBlocks = async () => {
      const currentBlockNumber = await web3.eth.getBlockNumber();

      if (currentBlockNumber >= targetBlockNumber) {
        console.log(`Target block number (${targetBlockNumber}) reached!`);
        resolve();
      } else {
        setTimeout(checkForNewBlocks, 5000); // Check every 5 seconds.
      }
    };

    checkForNewBlocks();
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
    await waitForBlocks(5);
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
