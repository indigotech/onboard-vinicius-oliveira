import { DEFAULT_USER_LOGIN, LOGIN_MUTATION, TEST_URL } from './test-constants';

import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../User';

describe('Login Tests', () => {
  it('Should be able to Login', async () => {
    const response = await axios.post(TEST_URL, {
      query: LOGIN_MUTATION,
      variables: { data: DEFAULT_USER_LOGIN },
    });

    expect(response.data.data).to.be.deep.eq({
      login: {
        user: {
          id: 1,
          email: 'bluepen@test.com',
          name: 'Blue Pen',
          birthDate: '12.02.1969',
        },
        token: 'the_token',
      },
    });
  });

  it('Should return an Error when Sign In with Unregistered User data', async () => {
    DEFAULT_USER_LOGIN.password = 'badpassword123';

    const response = await axios.post(TEST_URL, {
      query: LOGIN_MUTATION,
      variables: { data: DEFAULT_USER_LOGIN },
    });

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'User not found, please create an account, or review credentials',
      code: 401,
    });
  });
});
