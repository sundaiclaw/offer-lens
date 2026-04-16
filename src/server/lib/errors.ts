export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: unknown,
    public readonly exposeMessage = true,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class RequestValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'INVALID_REQUEST', details);
  }
}

export class ConfigurationError extends AppError {
  constructor(message = 'Server configuration is incomplete.') {
    super(message, 500, 'CONFIGURATION_ERROR', undefined, false);
  }
}

export class UpstreamAIError extends AppError {
  constructor(message = 'We could not finish the AI analysis right now.') {
    super(message, 502, 'UPSTREAM_AI_ERROR', undefined, true);
  }
}

export class UpstreamAITimeoutError extends AppError {
  constructor(message = 'The AI analysis timed out. Please try again.') {
    super(message, 504, 'UPSTREAM_AI_TIMEOUT', undefined, true);
  }
}

export class AIResponseParseError extends AppError {
  constructor(message = 'The AI response could not be validated.') {
    super(message, 502, 'INVALID_AI_RESPONSE', undefined, true);
  }
}

export const getErrorResponse = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        code: error.code,
        message: error.exposeMessage ? error.message : 'Something went wrong. Please try again.',
        details: error.details,
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong. Please try again.',
    },
  };
};
