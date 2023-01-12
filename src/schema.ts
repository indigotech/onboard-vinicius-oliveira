import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`

type Query {
    hello: String
    users: [User!]
    getUserByName(name: String!): User!
}

type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    birthDate: String
}

input UserInput {
    name: String!, email: String!, password: String!, birthDate: String
}

type Mutation {
    createUser(data: UserInput): User!
}

`);
