import { expect } from 'chai';
import { User } from '../interfaces';
import { seedUsers } from '../seed/seed-users';
import { userRepository } from '../utils';
import { getUsers } from './queries';
import { getExpectedPaginationOutput, getUsersFromDb } from './test-constants.utils';

describe('Find Users query tests', () => {
  const userPopulation = 50;

  before(async () => {
    await seedUsers(userPopulation);
  });

  after(async () => {
    userRepository.delete({});
  });

  it('Should return a list of Users', async () => {
    const response = await getUsers(userPopulation);
    const responseOutput = response.data.data.users;

    const usersFromDb = await getUsersFromDb();

    expect(responseOutput.users).to.be.deep.eq(usersFromDb);
  });

  it('Should return a Page of Users', async () => {
    const page = 1;

    const response = await axiosGetUsers(page);
    const responseOutput = response.data.data.users;

    const usersFromDb = await getUsersFromDb();

    expect(responseOutput).to.be.deep.eq(getExpectedPaginationOutput(usersFromDb, page, undefined, userPopulation));
  });

  it('Should return an Error when querying Users without being logged in', async () => {
    const response = await getUsers(undefined, 'bad_token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });

  it('Should return an Error when page number is exceeded', async () => {
    const page = 1000;

    const response = await axiosGetUsers(page);

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Page number exceeded', code: 401 });
  });

  it('Should return an Error when page number is an invalid input', async () => {
    const page = -1;

    const response = await axiosGetUsers(page);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Page number must be an Integer greater than 0',
      code: 401,
    });
  });
});
