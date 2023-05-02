import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LuckyShibaConfig } from './config/configuration';
import { Web3Service } from './services/web3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [LuckyShibaConfig],
      isGlobal: false,
    }),
  ],
  providers: [Web3Service],
  exports: [Web3Service],
})
export class CoreModule {}
