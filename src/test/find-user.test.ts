import { expect } from 'chai';
import { userRepository } from '../utils';
import { createUser, getUserById } from './queries';
import { DEFAULT_USER_INPUT, getExpectedUserOutput } from './test-constants.utils';

describe('Find User query tests', () => {
  afterEach(async () => {
    userRepository.delete({});
  });

  it('Should return User', async () => {
    await createUser(DEFAULT_USER_INPUT);

    const userFromDb = await userRepository.findOneBy({ email: DEFAULT_USER_INPUT.email });

    const response = await getUserById(userFromDb.id);

    const responseOutput = response.data.data.user;

    expect(responseOutput).to.be.deep.eq(getExpectedUserOutput(userFromDb));
  });

  it('Should return an Error when querying an user with Non-Existing Id', async () => {
    const response = await getUserById(-1);

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'User not present in the database', code: 404 });
  });

  it('Should return an Error when querying an user with bad Token', async () => {
    const response = await getUserById(1, 'bad-token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });
});
