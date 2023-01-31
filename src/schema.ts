import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`

type Query {
    hello: String
    user (id: Int): UserOutput!
    users (usersByPage: Int = 10, page: Int): UsersPagination
}

type User {
    id: Int!
    name: String!
    email: String!
    password: String!
    birthDate: String
    addresses: [Address]
}

input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String
}

type UsersPagination {
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

type Address {
    id: Int!
    cep: String!
    street: String!
    streetNum: Int!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
}

input AddressInput {
    street: String!
    cep: String!
    streetNum: Int!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
    userEmail: String!
}

type Mutation {
    createUser(input: UserInput): UserOutput!
    login(input: LoginInput): LoginOutput!
    createAddress(input: AddressInput): Address!
}

`);
