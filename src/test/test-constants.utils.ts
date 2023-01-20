import { LoginInput, LoginOutput, UserInput, UserOutput } from '../interfaces';
import { passwordHashing } from '../utils';

export const EXPECTED_REGISTERED_USER = {
  id: 1,
  name: 'Blue Pen',
  email: 'bluepen@test.com',
  password: passwordHashing('test123'),
  birthDate: '12.02.1969',
};

export const DEFAULT_USER_LOGIN_INPUT: LoginInput = {
  email: 'bluepen@test.com',
  password: 'test123',
  rememberMe: true,
};

export const EXPECTED_USER_OUTPUT: UserOutput = {
  id: 1,
  name: 'Blue Pen',
  email: 'bluepen@test.com',
  birthDate: '12.02.1969',
};

export const EXPECTED_LOGIN_OUTPUT = (token: string): LoginOutput => {
  return {
    user: EXPECTED_USER_OUTPUT,
    token: token,
  };
};

export const DEFAULT_USER_INPUT: UserInput = {
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
