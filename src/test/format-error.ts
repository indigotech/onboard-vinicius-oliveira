import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { unwrapResolverError } from '@apollo/server/errors';

export class CustomError extends Error {
  code: number;
  details?: string;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export function formatError(formattedError: GraphQLFormattedError, error: unknown) {
  if (error instanceof GraphQLError) {
    error = unwrapResolverError(error);
  }

  if (error instanceof CustomError) {
    return {
      message: error.message,
      code: error.code,
    };
  }

  return formattedError;
}
