import { GraphQLError } from 'graphql';

export class CustomError extends Error {
  code: number;
  details?: string;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    console.log(code);
  }
}

export function formatError(error: GraphQLError) {
  console.log(JSON.stringify(error));

  return {
    message: error.message,
    code: 401,
  };
}
