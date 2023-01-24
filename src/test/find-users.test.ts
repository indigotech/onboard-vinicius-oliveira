import { expect } from 'chai';
import { seedUsers } from '../seed/seed-users';
import { userRepository } from '../utils';
import { axiosGetUsers } from './queries';
import { getUsersFromDb } from './test-constants.utils';

describe('Find Users query tests', () => {
  const userPopulation = 50;

  before(async () => {
    await seedUsers(userPopulation);
  });

  after(async () => {
    userRepository.delete({});
  });

  it('Should return a list of Users', async () => {
    const response = await axiosGetUsers(userPopulation);
    const responseOutput = response.data.data.users;

    const usersFromDb = await getUsersFromDb(userPopulation);

    expect(responseOutput).to.be.deep.eq(usersFromDb);
  });

  it('Should return an Error when querying Users without being logged in', async () => {
    const response = await axiosGetUsers(undefined, 'bad_token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });
});
