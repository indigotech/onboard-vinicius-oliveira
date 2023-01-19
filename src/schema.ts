import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`

type Query {
    hello: String
}

type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    birthDate: String
}

input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String
}

type UserOutput {
    id: Int!
    name: String!
    email: String!
    birthDate: String
}

input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean!
}

type LoginOutput {
    user: UserOutput!
    token: String!
}

type Mutation {
    createUser(data: UserInput): User!
    login(data: LoginInput): LoginOutput!
}

`);
