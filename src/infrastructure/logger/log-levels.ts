import { config } from 'winston';

export type LoggerLogLevel = keyof config.CliConfigSetLevels;

type LoggerLogLevelMap = { [key: LoggerLogLevel]: { key: string; value: number } };

export const LOGGER_LOG_LEVEL_MAP: LoggerLogLevelMap = Object.entries(config.cli.levels).reduce((acc, [key, value]) => {
  acc[key] = { key, value };

  return acc;
}, {} as LoggerLogLevelMap);
