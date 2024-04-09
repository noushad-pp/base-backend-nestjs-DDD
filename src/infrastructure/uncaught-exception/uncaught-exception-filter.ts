import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodValidationException } from 'nestjs-zod';
import { ZodIssue } from 'nestjs-zod/z';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Catch()
export class UncaughtExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: Logger) {
    super();
  }

  public catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = this.getStatus(exception);

    const requestLog = this.formatRequest(request);
    const exceptionLog = this.formatException(exception);

    this.logger.error({ exceptionLog, requestLog }, UncaughtExceptionFilter.name);

    response.status(status).json({
      success: false,
      ...exceptionLog,
    });
  }

  private formatRequest(request: any): object | undefined {
    if (!request) {
      return;
    }

    return {
      path: request.route?.path,
      headers: request.headers,
      body: request.body,
      query: request.query,
    };
  }

  private getStatus(exception: any): number {
    if (exception instanceof ZodValidationException) {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    } else if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private formatException(exception: any): object {
    return {
      status: this.getStatus(exception),
      data: this.getData(exception),
      error: this.getError(exception),
      message: this.getMessage(exception),
    };
  }

  private getMessage(exception: any): string {
    const zodError = this.resolveZodError(exception);

    if (!!zodError) {
      return fromZodError(zodError).message;
    }

    const errorMessage = Array.isArray(exception) ? exception[0]?.message : exception.message;

    return errorMessage || 'Sorry we are experiencing technical problems.';
  }

  private getError(exception: any): string {
    const zodError = this.resolveZodError(exception);

    if (!!zodError) {
      return 'Validation error(s)';
    }

    return exception instanceof Error ? exception.constructor.name : 'Internal server errors';
  }

  // TODO: provide return type
  private getData(exception: any): ZodIssue[] | unknown[] {
    const zodError = this.resolveZodError(exception);

    return !!zodError ? zodError.issues : exception.errors || [];
  }

  private resolveZodError(exception: any): ZodError | void {
    if (exception instanceof ZodValidationException) {
      return exception.getZodError();
    } else if (exception instanceof ZodError) {
      return exception;
    }
  }
}
