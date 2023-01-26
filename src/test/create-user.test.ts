import { expect } from 'chai';
import { DEFAULT_USER_INPUT, getExpectedUserOutput } from './test-constants.utils';
import { createUser } from './queries';
import { passwordHashing, userRepository } from '../utils';

describe('Create User Mutation', () => {
  afterEach(async () => {
    await userRepository.delete({});
  });

  it('Should create a new User', async () => {
    const response = await createUser(DEFAULT_USER_INPUT);

    const responseOutput = response.data.data.createUser;

    const userFromDB = await userRepository.findOneBy({ id: responseOutput.id });

    expect(DEFAULT_USER_INPUT.name).to.be.deep.eq(userFromDB.name);
    expect(DEFAULT_USER_INPUT.email).to.be.deep.eq(userFromDB.email);
    expect(passwordHashing(DEFAULT_USER_INPUT.password)).to.be.deep.eq(userFromDB.password);
    expect(DEFAULT_USER_INPUT.birthDate).to.be.deep.eq(userFromDB.birthDate);
    expect(responseOutput).to.be.deep.eq(getExpectedUserOutput(userFromDB));
  });

  it('Should return an error when trying to Sign Up with duplicate e-mail', async () => {
    await createUser(DEFAULT_USER_INPUT);
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
