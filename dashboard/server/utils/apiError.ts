import type { H3Error } from 'h3';

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'
  | 'UPSTREAM_ERROR';

export function createApiError(options: {
  statusCode: number;
  message: string;
  code?: ApiErrorCode;
  details?: unknown;
}): H3Error {
  const code = options.code ?? mapStatusCodeToErrorCode(options.statusCode);

  return createError({
    statusCode: options.statusCode,
    statusMessage: options.message,
    data: {
      ok: false,
      error: {
        code,
        message: options.message,
        details: options.details
      }
    }
  });
}

export function createValidationError(details: unknown, message = 'Invalid request body') {
  return createApiError({
    statusCode: 400,
    code: 'BAD_REQUEST',
    message,
    details
  });
}

export function isDatabaseUniqueViolation(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === '23505';
}

function mapStatusCodeToErrorCode(statusCode: number): ApiErrorCode {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 429:
      return 'RATE_LIMITED';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}
