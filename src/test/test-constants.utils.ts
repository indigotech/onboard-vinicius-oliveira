import { generateToken } from '../resolvers';

export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const headers = { Authorization: generateToken(1, false) };

export const DEFAULT_USER_LOGIN: LoginInput = {
  email: 'bluepen@test.com',
  password: 'test123',
  rememberMe: true,
};

export const EXPECTED_USER: UserInput = {
  name: 'Blue Pen',
  email: 'bluepen@test.com',
  password: 'test123',
  birthDate: '12.02.1969',
};

export const TEST_URL = 'http://localhost:3001/';

export const CREATE_USER_MUTATION = `
mutation CreateUser($data: UserInput) {
  createUser(data: $data) {
    id
    name
    email
    password
    birthDate
  }
}
`;

export const LOGIN_MUTATION = `
mutation Mutation($data: LoginInput) {
  login(data: $data) {
    user {
      id
      email
      name
      birthDate
    }
    token
  }
}
`;
