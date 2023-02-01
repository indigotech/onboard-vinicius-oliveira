import { expect } from 'chai';
import { DEFAULT_USER_INPUT } from './test-constants.utils';
import { createUser } from './queries';
import { passwordHashing, userRepository } from '../utils';
import { UserOutput } from '../interfaces';

describe('Create User Mutation', () => {
  let responseOutput: UserOutput;

  beforeEach(async () => {
    const response = await createUser(DEFAULT_USER_INPUT);
    responseOutput = response.data.data.createUser;
  });

  afterEach(async () => {
    await userRepository.delete({});
  });

  it('Should create a new User', async () => {
    const userFromDb = await userRepository.findOneBy({ id: responseOutput.id });

    const { password, ...expectedResponse } = userFromDb;

    expect({
      ...DEFAULT_USER_INPUT,
      password: passwordHashing(DEFAULT_USER_INPUT.password),
      id: userFromDb.id,
    }).to.be.deep.eq(userFromDb);

    expect(responseOutput).to.be.deep.eq(expectedResponse);
  });

  it('Should return an error when trying to Sign Up with duplicate e-mail', async () => {
    const response = await createUser(DEFAULT_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
  });

  it('Should return an error when trying to Sign Up with a password shorter than 6 chatacters', async () => {
    const { ...BAD_USER_INPUT } = DEFAULT_USER_INPUT;

    BAD_USER_INPUT.password = 'short1';

    const response = await createUser(BAD_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Password must contain more than 6 characters',
      code: 401,
    });
  });

  it('Should return an error when trying to Sign Up with a password that contains only letters', async () => {
    const { ...BAD_USER_INPUT } = DEFAULT_USER_INPUT;

    BAD_USER_INPUT.password = 'password';

    const response = await createUser(BAD_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Password must contain at Least 1 Number and 1 Letter',
      code: 401,
    });
  });

  it('Should return an error when trying to Sign Up with a password that contains only numbers', async () => {
    const { ...BAD_USER_INPUT } = DEFAULT_USER_INPUT;

    BAD_USER_INPUT.password = '1234567';

    const response = await createUser(BAD_USER_INPUT);

    expect(response.data.errors[0]).to.be.deep.eq({
      message: 'Password must contain at Least 1 Number and 1 Letter',
      code: 401,
    });
  });

  it('Should return an error when trying to Sign Up a new User without being Logged In', async () => {
    const response = await createUser(DEFAULT_USER_INPUT, 'bad_token');

    expect(response.data.errors[0]).to.be.deep.eq({ message: 'Authentication Failed', code: 401 });
  });
});
