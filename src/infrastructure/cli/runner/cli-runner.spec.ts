import { createMock } from '@golevelup/ts-jest';
import { INestApplication, LoggerService, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { LoggerModule } from '../../logger/logger.module';
import { CliModule } from '../cli.module';

import { CliRunner } from './cli-runner';

@Module({})
class TestModule {}

describe('CliRunner', () => {
  let app: INestApplication;

  beforeEach(() => {
    app = createMock<INestApplication>();

    jest.spyOn(CliModule, 'register');
    jest.spyOn(NestFactory, 'create').mockResolvedValue(app);
    jest.spyOn(process, 'exit').mockImplementation();

    jest.spyOn(LoggerModule, 'createLogger').mockReturnValue(createMock<LoggerService>());
  });

  it('should create app and keep it alive with empty callback', async () => {
    const subject = new CliRunner({
      name: 'test cli runner',
      modules: [TestModule],
    });

    await subject.startApplication();

    expect(CliModule.register).toHaveBeenCalledTimes(1);
    expect(CliModule.register).toHaveBeenCalledWith([TestModule]);

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);

    expect(app.close).not.toHaveBeenCalled();
  });

  it('should create app, call callback and keep it alive', async () => {
    const callback = jest.fn();

    const subject = new CliRunner({
      name: 'test cli runner',
      modules: [TestModule],
      callback,
    });

    await subject.startApplication();

    expect(CliModule.register).toHaveBeenCalledTimes(1);
    expect(CliModule.register).toHaveBeenCalledWith([TestModule]);

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(app);

    expect(app.close).not.toHaveBeenCalled();
  });

  it('should create app and close after empty callback', async () => {
    const subject = new CliRunner({
      name: 'test cli runner once',
      modules: [TestModule],
    });

    await subject.runOnce();

    expect(CliModule.register).toHaveBeenCalledTimes(1);
    expect(CliModule.register).toHaveBeenCalledWith([TestModule]);

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);

    expect(app.close).toHaveBeenCalledTimes(1);
  });

  it('should create app, run callback and close', async () => {
    const callback = jest.fn();

    const subject = new CliRunner({
      name: 'test cli runner',
      modules: [TestModule],
      callback,
    });

    await subject.runOnce();

    expect(CliModule.register).toHaveBeenCalledTimes(1);
    expect(CliModule.register).toHaveBeenCalledWith([TestModule]);

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(app);

    expect(app.close).toHaveBeenCalledTimes(1);
  });

  it('should exit gracefully if error is thrown in start application', async () => {
    const callback = jest.fn(() => {
      throw new Error('Test errors');
    });

    const subject = new CliRunner({
      name: 'test cli runner',
      modules: [TestModule],
      callback,
    });

    await subject.startApplication();

    expect(CliModule.register).toHaveBeenCalledTimes(1);
    expect(CliModule.register).toHaveBeenCalledWith([TestModule]);

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(app);

    expect(app.close).toHaveBeenCalledTimes(1);

    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should exit gracefully if error is thrown in run once', async () => {
    const callback = jest.fn(() => {
      throw new Error('Test errors');
    });

    const subject = new CliRunner({
      name: 'test cli runner',
      modules: [TestModule],
      callback,
    });

    await subject.runOnce();

    expect(CliModule.register).toHaveBeenCalledTimes(1);
    expect(CliModule.register).toHaveBeenCalledWith([TestModule]);

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(app);

    expect(app.close).toHaveBeenCalledTimes(2);

    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
