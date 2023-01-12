import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`

type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String
}

input UserInput {
    name: String!, email: String!, birthDate: String
}

type Mutation {
    createUser(data: UserInput): User!
}

`);
