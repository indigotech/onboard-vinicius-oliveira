import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { unwrapResolverError } from '@apollo/server/errors';

export class CustomError extends Error {
  code: number;
  details?: string;

  constructor(message: string, code: number, details?: string) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export function formatError(formattedError: GraphQLFormattedError, error: unknown) {
  let originalError = error;

  if (error instanceof GraphQLError) {
    originalError = unwrapResolverError(error);
  }

  if (originalError instanceof CustomError) {
    return {
      message: originalError.message,
      code: originalError.code,
    };
  } else {
    return { message: 'Internal Server Error', code: 500, details: (error as Error).message };
  }
}
