import { Config } from '../models/config';

export const LuckyShibaConfig = (): Config => ({
  app: {
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : 3000,
  },
  web3: {
    url: process.env.WEB3_NODE_URL || 'https://rpc-mumbai.maticvigil.com/',
  },
  contract: {
    luckyShibaAddress:
      process.env.LUCKY_SHIBA_CONTRACT_ADDRESS,
    applicationPrivateKey:
      process.env.APPLICATION_PK,
    applicationAddress:
      process.env.APPLICATION_ADDRESS,

  },
});
