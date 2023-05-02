import { CoreModule } from '@/core/core.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SelectorService } from './services/selector.service';

@Module({
  imports: [CoreModule, ScheduleModule.forRoot()],
  providers: [SelectorService],
})
export class SelectorModule {}
