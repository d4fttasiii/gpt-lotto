import { Config } from './models/config';

const LuckyShibaConfig = (): Config => ({
  web3: {
    url: process.env.WEB3_NODE_URL || 'https://rpc-mumbai.maticvigil.com/',
  },
  contract: {
    luckyShibaAddress: process.env.LUCKY_SHIBA_CONTRACT_ADDRESS || '',
    applicationPrivateKey: process.env.APPLICATION_PK || '',
    applicationAddress: process.env.APPLICATION_ADDRESS || '',
  },
});

export default LuckyShibaConfig;
