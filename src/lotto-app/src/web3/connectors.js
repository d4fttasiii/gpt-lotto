// src/web3/connectors.js
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 137], // Mainnet, Ropsten, Rinkeby, Goerli, Kovan
});
