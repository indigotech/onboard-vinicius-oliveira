import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`

type Query {
    hello: String
    user (id: Int): UserOutput!
    users (usersByPage: Int = 10, page: Int): UsersPagination
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
    location: String!
    total: Int!
    after: Int!
    before: Int!
    users: [UserOutput]
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
