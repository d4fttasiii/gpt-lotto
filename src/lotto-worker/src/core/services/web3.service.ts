import { ContractConfig, Web3Config } from '@/core/models/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { LUCKY_SHIBA } from '../abis/lucky-shiba';

@Injectable()
export class Web3Service {
  luckyShiba: Contract;
  private readonly url: string;
  private readonly web3: Web3;

  constructor(private configService: ConfigService) {
    const contractConfig = this.configService.get<ContractConfig>('contract');
    const web3Config = this.configService.get<Web3Config>('web3');
    this.url = web3Config.url;
    this.web3 = new Web3(this.url);
    this.luckyShiba = new this.web3.eth.Contract(
      LUCKY_SHIBA,
      contractConfig.luckyShibaAddress,
    );
  }

  async accountInfo(account: string): Promise<string> {
    const initialvalue = await this.web3.eth.getBalance(account);
    const balance = this.web3.utils.fromWei(initialvalue, 'ether');

    return balance;
  }

  async getBlockNumber(): Promise<number> {
    return await this.web3.eth.getBlockNumber();
  }

  async getNativeBalance(address: string): Promise<string> {
    return await this.web3.eth.getBalance(address);
  }

  async estimateGas(tx: any): Promise<number> {
    const gas = await this.web3.eth.estimateGas(tx);
    return Math.floor(gas * 1.05);
  }

  async signTransaction(tx: any, pk: string) {
    const signedTx = await this.web3.eth.accounts.signTransaction(tx, pk);

    return signedTx;
  }

  async sendSignedTransaction(signedTx: string) {
    return await this.web3.eth.sendSignedTransaction(signedTx);
  }
}
