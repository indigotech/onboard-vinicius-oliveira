import { expect } from 'chai';
import { axiosGetUserById } from './queries';
import { EXPECTED_USER_OUTPUT } from './test-constants.utils';

describe('Find User query tests', () => {
  it('Should return User', async () => {
    const response = await axiosGetUserById(1);

    const responseOutput = response.data.data.user;

    expect(responseOutput).to.be.deep.eq(EXPECTED_USER_OUTPUT);
  });

  it('Should return an Error when querying an user with Non-Existing Id', async () => {
    const response = await axiosGetUserById(-1);

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'User not present in the database', code: 401 });
  });

  it('Should return an Error when querying an user with bad Token', async () => {
    const response = await axiosGetUserById(1, 'bad-token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });
});
