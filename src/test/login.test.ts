<<<<<<< HEAD
=======
import { DEFAULT_USER_LOGIN, LOGIN_MUTATION, TEST_URL } from './test-constants';

import { generateToken } from '../resolvers';

import axios from 'axios';
>>>>>>> 01a87a0 (Adding a Remeber Me function)
import { expect } from 'chai';

import { DEFAULT_USER_LOGIN_INPUT, EXPECTED_LOGIN_OUTPUT } from './test-constants.utils';
import { axiosLoginUser } from './queries';

describe('Login Tests', () => {
  it('Should be able to Login', async () => {
    const response = await axiosLoginUser(DEFAULT_USER_LOGIN_INPUT);

<<<<<<< HEAD
    const resposeOutput = response.data.data.login;

    const token = response.data.data.login.token;

    expect(resposeOutput).to.be.deep.eq(EXPECTED_LOGIN_OUTPUT(token));
  });

  it('Should return an Error when Sign In with Unregistered User password', async () => {
    DEFAULT_USER_LOGIN_INPUT.password = 'badpassword123';

    const response = await axiosLoginUser(DEFAULT_USER_LOGIN_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'User not found, please create an account, or review credentials',
      code: 401,
=======
    const expectedResponse = response.data.data;

    const token = generateToken(expectedResponse.login.user.id, DEFAULT_USER_LOGIN.rememberMe);

    expect(expectedResponse).to.be.deep.eq({
      login: {
        user: {
          id: 1,
          email: 'bluepen@test.com',
          name: 'Blue Pen',
          birthDate: '12.02.1969',
        },
        token: token,
      },
>>>>>>> 01a87a0 (Adding a Remeber Me function)
    });
  });

  it('Should return an Error when Sign In with Unregistered User E-mail', async () => {
    DEFAULT_USER_LOGIN_INPUT.email = 'wrong@email.com';

    const response = await axiosLoginUser(DEFAULT_USER_LOGIN_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'User not found, please create an account, or review credentials',
      code: 401,
    });
  });
});
