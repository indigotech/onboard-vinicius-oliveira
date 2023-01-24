import { expect } from 'chai';
import { insertUsersIntoDb, startSeed } from '../seed-users';
import { userRepository } from '../utils';
import { axiosCreateUser, axiosGetUserById, axiosGetUsers } from './queries';
import { DEFAULT_USER_INPUT, getExpectedUserOutput } from './test-constants.utils';

describe('Find Users query tests', () => {
  afterEach(async () => {
    userRepository.delete({});
  });

  it('Should return a list of Users', async () => {
    await insertUsersIntoDb(0);

    const resonse = await axiosGetUsers();

    const test = await userRepository.createQueryBuilder('user').orderBy('user.id').getMany();

    console.log(test);
    console.log(resonse.data.data.users);
  });
});
