import { Module } from '@nestjs/common';

import { AppService } from 'application/app/app.service';

import { AppController } from './app/app.controller';

@Module({
  imports: [],
  providers: [AppService],
  controllers: [AppController],
})
export class ControllerModule {}
