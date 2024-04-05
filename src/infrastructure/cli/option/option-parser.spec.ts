import { InvalidWholeNumberError, MissingOptionError, OptionParser } from './option-parser';

describe('OptionsParser', () => {
  describe('should parse valid whole number array', () => {
    const testCases = [
      {
        input: '1,2,3.12',
        expected: [1, 2, 3],
      },
      {
        input: '0,3,31,2',
        expected: [0, 3, 31, 2],
      },
    ];

    it.each(testCases)('$input', ({ input, expected }) => {
      OptionParser.options = [`--option=${input}`];

      expect(OptionParser.parseWholeNumberArray('option')).toEqual(expected);
    });

    it('input is not given', () => {
      OptionParser.options = [];

      expect(OptionParser.parseWholeNumberArray('option')).toBeUndefined();
    });
  });

  describe('should throw error if whole number array is invalid', () => {
    const numericTestCases = [{ input: '1,-2,3' }, { input: '1,test,3' }, { input: '1,{},3' }];

    it.each(numericTestCases)('"$input"', ({ input }) => {
      OptionParser.options = [`--option=${input}`];

      expect(() => OptionParser.parseWholeNumberArray('option')).toThrow(InvalidWholeNumberError);
    });
  });

  describe('should parse valid whole number', () => {
    const testCases = [
      { input: '0', expected: 0 },
      { input: '1', expected: 1 },
      { input: '10', expected: 10 },
      { input: '10.21', expected: 10 },
      { input: '59', expected: 59 },
      { input: '60', expected: 60 },
    ];

    it.each(testCases)('"$input" to $input', ({ input, expected }) => {
      OptionParser.options = [`--option=${input}`];

      expect(OptionParser.parseWholeNumber('option')).toBe(expected);
    });
  });

  describe('should throw error if whole number is invalid', () => {
    const numericTestCases = [{ input: '-1' }, { input: '-61' }, { input: 'test' }, { input: '{}' }];

    it.each(numericTestCases)('"$input"', ({ input }) => {
      OptionParser.options = [`--option=${input}`];

      expect(() => OptionParser.parseWholeNumber('option')).toThrow(InvalidWholeNumberError);
    });

    it('input is not given', () => {
      OptionParser.options = [];

      expect(() => OptionParser.parseWholeNumber('option')).toThrow(MissingOptionError);
    });
  });
});
