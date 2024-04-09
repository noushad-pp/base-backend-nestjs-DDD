import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError, ZodIssue } from 'nestjs-zod/z';

import { UncaughtExceptionFilter } from './uncaught-exception-filter';

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  rollbarLog: jest.fn(),
};

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
  success: false,
  data: [],
  error: 'something',
  message: 'something',
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('Uncaught exception filter', () => {
  let service: UncaughtExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UncaughtExceptionFilter,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<UncaughtExceptionFilter>(UncaughtExceptionFilter);
  });

  it('should catch http exception', () => {
    service.catch(new BadRequestException('This was not a valid request'), mockArgumentsHost);
    expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
    expect(mockGetResponse).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        data: [],
        message: 'This was not a valid request',
        error: 'BadRequestException',
      })
    );
  });

  it('should catch validation exception', () => {
    const issues: ZodIssue[] = [
      {
        code: 'too_small',
        inclusive: false,
        message: 'Number must be greater than 0',
        minimum: 0,
        path: ['id'],
        type: 'number',
      },
      {
        code: 'invalid_string',
        message: 'Invalid email',
        path: ['email'],
        validation: 'email',
      },
    ];

    service.catch(new ZodValidationException(new ZodError(issues as any)), mockArgumentsHost);
    service.catch(new ZodError(issues as any), mockArgumentsHost);
    expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(2);
    expect(mockGetResponse).toHaveBeenCalledTimes(2);
    expect(mockStatus).toHaveBeenCalledTimes(2);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockJson).toHaveBeenCalledTimes(2);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      data: issues,
      error: 'Validation error(s)',
      message: 'Validation error: Number must be greater than 0 at "id"; Invalid email at "email"',
    });
  });

  it('should catch plain errors', () => {
    service.catch(new Error('Some random errors'), mockArgumentsHost);
    expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
    expect(mockGetResponse).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: [],
        success: false,
        error: 'Error',
        message: 'Some random errors',
      })
    );
  });

  it('should catch empty object and assign defaults', () => {
    service.catch({}, mockArgumentsHost);
    expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
    expect(mockGetResponse).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: [],
        success: false,
        error: 'Internal server errors',
        message: 'Sorry we are experiencing technical problems.',
      })
    );
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('should map status correctly', () => {
  //   const testCases = [
  //     { error: new InvalidBearerTokenError(), status: HttpStatus.FORBIDDEN },
  //     { error: new InvalidAuthUserError(), status: HttpStatus.FORBIDDEN },
  //     { error: new LegacyApiFailedError(), status: HttpStatus.FAILED_DEPENDENCY },
  //   ];
  //
  // eslint-disable-next-line jest/no-commented-out-tests
  //   it.each(testCases)('$errors $status', ({ error, status }) => {
  //     service.catch(error, mockArgumentsHost);
  //
  //     expect(mockStatus).toHaveBeenCalledWith(status);
  //   });
  // });
});
