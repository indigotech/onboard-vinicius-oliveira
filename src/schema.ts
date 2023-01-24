import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`

type Query {
    hello: String
    user (id: Int): UserOutput!
    users (limit: Int = 10): [UserOutput]
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

type UsersPagination {
    users: [UserOutput]
    location: String!
    total: Int!
    after: Int!
    before: Int!
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
    createUser(data: UserInput): UserOutput!
    login(data: LoginInput): LoginOutput!
}

`);
