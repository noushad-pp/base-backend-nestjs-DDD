import { config, format, LoggerOptions, transports } from 'winston';

import { ConfigService } from '../config/config.service';

type LoggerFormat = NonNullable<LoggerOptions['format']>;

export const getLoggerFormats = (isProd: boolean): LoggerFormat => {
  const timestampFormat = format.timestamp({ format: 'isoDateTime' });
  const jsonFormat = format.json();
  const formats = [timestampFormat, jsonFormat];

  if (!isProd) {
    const colorizeFormat = format.colorize({ all: true });

    formats.push(colorizeFormat);
  }

  return format.combine(...formats);
};

const configService = new ConfigService();

export const getLoggerOptions = (): LoggerOptions => ({
  levels: config.cli.levels, // winston supports 3 kinds of levels: npm, syslog, cli
  silent: configService.isTestEnvironment(),
  level: configService.getLogLevelConfig(), // one of cli levels: error, warn, help, data, info, debug, prompt, verbose, input, silly
  format: getLoggerFormats(configService.isProdEnvironment()),
  transports: new transports.Console(),
});
