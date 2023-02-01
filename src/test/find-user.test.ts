import { expect } from 'chai';
import { userRepository } from '../utils';
import { createUser, getUserById } from './queries';
import { DEFAULT_USER_INPUT } from './test-constants.utils';

describe('Find User query tests', () => {
  afterEach(async () => {
    userRepository.delete({});
  });

  it('Should return User', async () => {
    await createUser(DEFAULT_USER_INPUT);

    const userFromDb = await userRepository.findOne({
      where: { email: DEFAULT_USER_INPUT.email },
      relations: { address: true },
    });

    const response = await getUserById(userFromDb.id);

    const responseOutput = response.data.data.user;

    const { password, ...expectedResponse } = userFromDb;

    expect(responseOutput).to.be.deep.eq(expectedResponse);
  });

  it('Should return an Error when querying an user with Non-Existing Id', async () => {
    const response = await getUserById(-1);

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'User not found in the database', code: 404 });
  });

  it('Should return an Error when querying an user with bad Token', async () => {
    const response = await getUserById(1, 'bad-token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });
});
