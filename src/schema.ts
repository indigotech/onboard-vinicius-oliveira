import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`

type Query {
    hello: String
    users: [User!]
}

type User {
    id: ID!
    name: String!
    password: String!
}

type Mutation {
    createUser(name: String, password: String): User!
}

`);
