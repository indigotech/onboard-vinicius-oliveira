import { userRepository } from '../utils';
import { LoginInput, LoginOutput, UserInput, UserOutput, AddressInput } from '../interfaces';

export const DEFAULT_USER_LOGIN_INPUT: LoginInput = {
  email: 'bluepen@test.com',
  password: 'test123',
  rememberMe: true,
};

export const getExpectedLoginOutput = (userOutput: UserOutput, token: string): LoginOutput => {
  return {
    user: userOutput,
    token: token,
  };
};

export const getUsersFromDb = async () => {
  const usersFromDb = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.address', 'address')
    .orderBy('user.name')
    .getMany();

  const users = usersFromDb.map((element) => {
    const { password, ...user } = element;
    return user;
  });

  return users;
};

export const DEFAULT_ADDRESS_INPUT: AddressInput = {
  street: 'Av. Dr. Arnaldo',
  cep: '01255-000',
  streetNum: 2194,
  complement: null,
  neighborhood: 'Sumaré',
  city: 'São Paulo',
  state: 'SP',
  userEmail: 'bluepen@test.com',
};

export const DEFAULT_USER_INPUT: UserInput = {
  name: 'Blue Pen',
  email: 'bluepen@test.com',
  password: 'test123',
  birthDate: '12/02/1969',
};

export const TEST_URL = 'http://localhost:3001/';

export const CREATE_USER_MUTATION = `
mutation CreateUser($input: UserInput) {
  createUser(input: $input) {
    id
    name
    email
    birthDate
  }
}
`;

export const LOGIN_MUTATION = `
mutation Login($input: LoginInput) {
  login(input: $input) {
    user {
      id
      name
      email
      birthDate
    }
    token
  }
}
`;

export const FIND_USER_BY_ID_QUERY = `
query User($userId: Int) {
  user(id: $userId) {
    id
    name
    email
    birthDate
    address {
      id
      cep
      street
      streetNum
      complement
      neighborhood
      city
      state
    }
  }
}
`;

export const FIND_USERS_QUERY = `
query Users($usersByPage: Int, $page: Int) {
  users(usersByPage: $usersByPage, page: $page) {
    total
    after
    before
    users {
      id
      name
      email
      birthDate
      address {
        id
        streetNum
        street
        state
        neighborhood
        complement
        city
        cep
      }
    }
  }
}
`;

export const CREATE_ADDRESS_MUTATION = `
mutation CreateAddress($input: AddressInput) {
  createAddress(input: $input) {
    id
    cep
    street
    streetNum
    complement
    neighborhood
    city
    state
  }
}
`;
