import { ContractConfig } from '@/core/models/config';
import { Web3Service } from '@/core/services/web3.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SelectorService {
  private contractCfg: ContractConfig;

  constructor(private web3: Web3Service, private configService: ConfigService) {
    this.contractCfg = this.configService.get<ContractConfig>('contract');
  }

  @Cron('*/1 * * * *')
  async doDrawNumbers() {
    console.log(`doDrawNumbers`);
    const ticketNumbers = await this.getTicketNumber();
    if (ticketNumbers > 0) {
      // await this.drawWinningNumbers();
      await this.distributePrizes();
    } else {
      console.warn('Skipped drawing winning numbers & prize distro');
    }
  }

  private async getTicketNumber(): Promise<number> {
    const ticketNumbers = await this.web3.luckyShiba.methods
      .getTicketCount()
      .call();
    return parseInt(ticketNumbers, 10);
  }

  private async drawWinningNumbers() {
    const encodedABI = this.web3.luckyShiba.methods
      .drawWinningNumbers()
      .encodeABI();

    const tx = {
      from: this.contractCfg.applicationAddress,
      to: this.contractCfg.luckyShibaAddress,
      gas: 500000,
      data: encodedABI,
    };

    const gas = await this.web3.estimateGas(tx);
    tx.gas = gas;

    const signedTx = await this.web3.signTransaction(
      tx,
      this.contractCfg.applicationPrivateKey,
    );

    const result = await this.web3.sendSignedTransaction(
      signedTx.rawTransaction,
    );
    console.log(`Winning numbers have been drawn `, result.transactionHash);
  }

  private async distributePrizes() {
    const encodedABI = this.web3.luckyShiba.methods
      .distributePrizes()
      .encodeABI();

    const tx = {
      from: this.contractCfg.applicationAddress,
      to: this.contractCfg.luckyShibaAddress,
      gas: 1000000,
      data: encodedABI,
    };

    const gas = await this.web3.estimateGas(tx);
    tx.gas = gas;

    const signedTx = await this.web3.signTransaction(
      tx,
      this.contractCfg.applicationPrivateKey,
    );

    const result = await this.web3.sendSignedTransaction(
      signedTx.rawTransaction,
    );
    console.log(`Prizes distributed `, result.transactionHash);
  }
}
