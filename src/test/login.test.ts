import { expect } from 'chai';

import { DEFAULT_USER_INPUT, DEFAULT_USER_LOGIN_INPUT } from './test-constants.utils';
import { createUser, loginUser } from './queries';
import { userRepository } from '../utils';

describe('Login Tests', () => {
  afterEach(async () => {
    userRepository.delete({});
  });

  it('Should be able to Login', async () => {
    await createUser(DEFAULT_USER_INPUT);

    const response = await loginUser(DEFAULT_USER_LOGIN_INPUT);

    const responseOutput = response.data.data.login;

    const token = response.data.data.login.token;

    const { password, ...userFromDB } = await userRepository.findOneBy({ email: responseOutput.user.email });

    expect(responseOutput).to.be.deep.eq({
      user: userFromDB,
      token: token,
    });
  });

  it('Should return an Error when Sign In with Unregistered User password', async () => {
    const { ...BAD_LOGIN_INPUT } = DEFAULT_USER_LOGIN_INPUT;

    BAD_LOGIN_INPUT.password = 'badpassword123';

    const response = await loginUser(BAD_LOGIN_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'User not found, please create an account, or review credentials',
      code: 401,
    });
  });

  it('Should return an Error when Sign In with Unregistered User E-mail', async () => {
    const { ...BAD_LOGIN_INPUT } = DEFAULT_USER_LOGIN_INPUT;

    DEFAULT_USER_LOGIN_INPUT.email = 'wrong@email.com';

    const response = await loginUser(BAD_LOGIN_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'User not found, please create an account, or review credentials',
      code: 401,
    });
  });
});
