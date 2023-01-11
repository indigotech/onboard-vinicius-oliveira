import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`
type Query {
    hello: String!
}

`);
