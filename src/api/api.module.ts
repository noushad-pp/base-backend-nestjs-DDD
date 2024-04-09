import { Module } from '@nestjs/common';

import { ApplicationModule } from 'application/application.module';

import { UncaughtExceptionModule } from 'infrastructure/uncaught-exception/uncaught-exception.module';
import { ValidationModule } from 'infrastructure/validation/validation.module';

import { ControllerModule } from './controller.module';

@Module({
  imports: [ValidationModule, UncaughtExceptionModule, ControllerModule, ApplicationModule],
})
export class ApiModule {}
