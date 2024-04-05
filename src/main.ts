import { INestApplication } from '@nestjs/common';
import { AppModule } from 'api/app.module';
import { CliRunner } from 'infrastructure/cli';

async function preInitCallback(app: INestApplication): Promise<void> {
  app.setGlobalPrefix('/api');
}

async function callback(app: INestApplication): Promise<void> {
  await app.listen(process.env.NODE_PORT || 3000);
}

const runner = new CliRunner({
  name: 'api',
  modules: [AppModule],
  preInitCallback,
  callback,
});

runner.startApplication();
