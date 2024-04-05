import { z } from 'nestjs-zod/z';

export class InvalidWholeNumberError extends Error {
  constructor(optionName: string, value: string) {
    super(`CliOptionParserInvalidWholeNumber: ${optionName} ${value}`);
  }
}

export class MissingOptionError extends Error {
  constructor(option: string) {
    super(`CliOptionParserMissingOption: ${option}`);
  }
}

const numberStringSchema = z.coerce.number();
const isNumberString = (value: string): boolean => numberStringSchema.safeParse(value).success;

export class OptionParser {
  public static options = process.argv.slice(2);

  public static parseWholeNumberArray(optionName: string): number[] | undefined {
    const rawValue = this.findRawOptionValue(optionName);

    if (rawValue === undefined) {
      return undefined;
    }

    const rawValues = rawValue.split(',');

    return rawValues.map((rawValue) => this.parseWholeNumberOptionValue(optionName, rawValue));
  }

  public static parseWholeNumber(optionName: string): number {
    const rawValue = this.findRawOptionValue(optionName);

    // TODO: Check if parsers should be made agnostic of mandatory check and move error handling to the caller
    if (rawValue === undefined) {
      throw new MissingOptionError(optionName);
    }

    return this.parseWholeNumberOptionValue(optionName, rawValue);
  }

  private static parseWholeNumberOptionValue(optionName: string, rawValue: string) {
    if (!isNumberString(rawValue)) {
      throw new InvalidWholeNumberError(optionName, rawValue);
    }

    const numericValue = parseInt(rawValue);

    if (numericValue < 0) {
      throw new InvalidWholeNumberError(optionName, rawValue);
    }

    return numericValue;
  }

  private static findRawOptionValue(optionName: string): string | undefined {
    const optionPrefix = `--${optionName}=`;
    const rawOptionValue = this.options.find((it) => it.startsWith(optionPrefix));

    if (!rawOptionValue) {
      return undefined;
    }

    return rawOptionValue.replace(optionPrefix, '');
  }
}
