import { expect } from 'chai';
import { DEFAULT_USER_INPUT, EXPECTED_USER_OUTPUT, EXPECTED_REGISTERED_USER } from './test-constants.utils';
import { axiosCreateUser } from './queries';
import { userRepository } from '../utils';

describe('Create User Mutation', () => {
  it('Should create a new User', async () => {
    const response = await axiosCreateUser(DEFAULT_USER_INPUT);

    const responseOutput = response.data.data.createUser;

    const userFromDB = await userRepository.findOneBy({ id: responseOutput.id });

    expect(responseOutput).to.be.deep.eq(EXPECTED_USER_OUTPUT);
    expect(userFromDB).to.be.deep.eq(EXPECTED_REGISTERED_USER);
  });

  it('Should return an error when trying to Sign Up with duplicate e-mail', async () => {
    const response = await axiosCreateUser(DEFAULT_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
  });

  it('Should return an error when trying to Sign Up with a password shorter than 6 chatacters', async () => {
    DEFAULT_USER_INPUT.email = 'test@email.com';
    DEFAULT_USER_INPUT.password = 'short1';

    const response = await axiosCreateUser(DEFAULT_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Password must contain more than 6 characters',
      code: 401,
    });
  });

  it('Should return an error when trying to Sign Up with a password that contains only text', async () => {
    DEFAULT_USER_INPUT.email = 'test@email.com';
    DEFAULT_USER_INPUT.password = 'password';

    const response = await axiosCreateUser(DEFAULT_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Password must contain at Least 1 Number and 1 Letter',
      code: 401,
    });
  });

  it('Should return an error when trying to Sign Up with a password that contains only number', async () => {
    DEFAULT_USER_INPUT.email = 'test@email.com';
    DEFAULT_USER_INPUT.password = '1234567';

    const response = await axiosCreateUser(DEFAULT_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Password must contain at Least 1 Number and 1 Letter',
      code: 401,
    });
  });
});
