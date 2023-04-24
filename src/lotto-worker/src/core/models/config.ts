export interface Config {
  app: AppConfig;
  web3: Web3Config;
  contract: ContractConfig;
}

export interface Web3Config {
  url: string;
}

export interface AppConfig {
  port: number;
}

export interface ContractConfig {
  luckyShibaAddress: string;
  applicationPrivateKey: string;
  applicationAddress: string;
}
