import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LuckyShibaConfig } from './core/config/configuration';
import { CoreModule } from './core/core.module';
import { SelectorModule } from './selector/selector.module';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      load: [LuckyShibaConfig],
      isGlobal: true,
    }),
    SelectorModule,
  ],
})
export class AppModule {}
