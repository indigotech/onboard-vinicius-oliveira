import { userRepository } from '../utils';
import { LoginInput, LoginOutput, UserInput, UserOutput, UsersPagination } from '../interfaces';

export const DEFAULT_USER_LOGIN_INPUT: LoginInput = {
  email: 'bluepen@test.com',
  password: 'test123',
  rememberMe: true,
};

export const getExpectedUserOutput = (userOutput: UserOutput) => {
  return { id: userOutput.id, name: userOutput.name, email: userOutput.email, birthDate: userOutput.birthDate };
};

export const getExpectedLoginOutput = (userOutput: UserOutput, token: string): LoginOutput => {
  return {
    user: userOutput,
    token: token,
  };
};

export const getExpectedPaginationOutput = (
  users: [User],
  page: number,
  usersByPage: number,
  totalUsers: number,
): UsersPagination => {
  if (!usersByPage) {
    usersByPage = 10;
  }

  const before = usersByPage * (page - 1);
  const after = totalUsers - (before + usersByPage);
  const pageNum = Math.ceil(totalUsers / usersByPage);

  const pageScope = before + usersByPage;

  return {
    location: `Page ${page} of ${pageNum}`,
    total: totalUsers,
    after: after,
    before: before,
    users: users.slice(before, pageScope) as [User],
  };
};

export const getUsersFromDb = async () => {
  const usersFromDb = await userRepository.createQueryBuilder('user').orderBy('user.name').getMany();

  const users = usersFromDb.map((element) => {
    const { password, ...user } = element;
    return user;
  });

  return users as [UserOutput];
};

export const DEFAULT_USER_INPUT: UserInput = {
  name: 'Blue Pen',
  email: 'bluepen@test.com',
  password: 'test123',
  birthDate: '12/02/1969',
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

export const FIND_USER_BY_ID_QUERY = `
query User($userId: Int) {
  user(id: $userId) {
    id
    name
    email
    birthDate
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
    }
  }
}
`;
