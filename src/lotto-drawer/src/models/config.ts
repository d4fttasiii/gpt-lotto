export interface Config {
  web3: Web3Config;
  contract: ContractConfig;
}

export interface Web3Config {
  url: string;
}

export interface ContractConfig {
  luckyShibaAddress: string;
  applicationPrivateKey: string;
  applicationAddress: string;
}
