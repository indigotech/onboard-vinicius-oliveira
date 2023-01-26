import { expect } from 'chai';
import { seedUsers } from '../seed/seed-users';
import { userRepository } from '../utils';
import { getUsers } from './queries';
import { getUsersFromDb } from './test-constants.utils';

describe('Find Users query tests', () => {
  const userPopulation = 50;

  before(async () => {
    await seedUsers(userPopulation);
  });

  after(async () => {
    userRepository.delete({});
  });

  it('Should return a list of All Users', async () => {
    const response = await getUsers(1, userPopulation);
    const responseOutput = response.data.data.users;

    const usersFromDb = await getUsersFromDb();

    for (let i = 0; i < userPopulation; i++) {
      expect(responseOutput.users[i].id).to.be.eq(usersFromDb[i].id);
      expect(responseOutput.users[i].name).to.be.eq(usersFromDb[i].name);
      expect(responseOutput.users[i].email).to.be.eq(usersFromDb[i].email);
      expect(responseOutput.users[i].birthDate).to.be.eq(usersFromDb[i].birthDate);
    }

    expect(responseOutput).to.be.deep.eq({
      total: userPopulation,
      after: 0,
      before: 0,
      users: usersFromDb,
    });
  });

  it('Should return the first Page of Users', async () => {
    const page = 1;

    const response = await getUsers(page);
    const responseOutput = response.data.data.users;

    const usersFromDb = await getUsersFromDb();

    expect(responseOutput).to.be.deep.eq({
      total: userPopulation,
      after: 40,
      before: 0,
      users: usersFromDb.slice(0, 10),
    });
  });

  it('Should return a page in the middle of Pagination', async () => {
    const page = 5;
    const usersByPage = 5;

    const response = await getUsers(page, usersByPage);
    const responseOutput = response.data.data.users;

    const usersFromDb = await getUsersFromDb();

    expect(responseOutput).to.be.deep.eq({
      total: userPopulation,
      after: 25,
      before: 20,
      users: usersFromDb.slice(20, 25),
    });
  });

  it('Should return the last Page of Users that contains data', async () => {
    const page = 5;
    const usersByPage = 12;

    const response = await getUsers(page, usersByPage);
    const responseOutput = response.data.data.users;

    const usersFromDb = await getUsersFromDb();

    expect(responseOutput).to.be.deep.eq({
      total: userPopulation,
      after: 0,
      before: 48,
      users: usersFromDb.slice(48),
    });
  });

  it('Should return an Error when querying Users without being logged in', async () => {
    const response = await getUsers(1, undefined, 'bad_token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });

  it('Should return an Error when page number is an invalid input', async () => {
    const page = -1;

    const response = await getUsers(page);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Page number must be an Integer greater than 0',
      code: 401,
    });
  });
});
