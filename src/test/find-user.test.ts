import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../User';
import { TEST_URL, headers, FIND_USER_BY_ID_QUERY, DEFAULT_USER } from './test-constants.utils';

const userRepository = AppDataSource.getRepository(User);

describe('Find User query tests', () => {
  it('Should return User', async () => {
    const response = await axios.post(
      TEST_URL,
      {
        query: FIND_USER_BY_ID_QUERY,
        variables: { findUserByIdId: DEFAULT_USER.id },
      },
      {
        headers,
      },
    );

    const responseUser = response.data.data.findUserById;

    const { password, ...userFromDB } = await userRepository.findOneBy({
      id: DEFAULT_USER.id,
    });

    expect(responseUser).to.be.deep.eq(userFromDB);
  });

  it('Should return an Error when querying an user with Non-Existing Id', async () => {
    const response = await axios.post(
      TEST_URL,
      {
        query: FIND_USER_BY_ID_QUERY,
        variables: { findUserByIdId: -1 },
      },
      {
        headers,
      },
    );

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'User not present in the database', code: 401 });
  });

  it('Should return an Error when querying an user with bad Token', async () => {
    const response = await axios.post(
      TEST_URL,
      {
        query: FIND_USER_BY_ID_QUERY,
        variables: { findUserByIdId: DEFAULT_USER.id },
      },
      {
        headers: { Authorization: 'bad_token' },
      },
    );

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });
});
