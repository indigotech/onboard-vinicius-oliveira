import axios from 'axios';
import { expect } from 'chai';
import { passwordHashing } from '../resolvers';
import { AppDataSource } from '../data-source';
import { User } from '../User';
import { EXPECTED_USER, CREATE_USER_MUTATION, TEST_URL, headers } from './test-constants.utils';

before(async () => {
  await createFirstUser();
});

describe('User Tests', () => {
  describe('createUser mutation Tests', () => {
    it('Should create a new user', async () => {
      const response = await axios.post(
        TEST_URL,
        {
          query: CREATE_USER_MUTATION,
          variables: { data: EXPECTED_USER },
        },
        {
          headers,
        },
      );

      const expectedResponse = response.data.data.createUser;
      const { id, ...expectedInput } = response.data.data.createUser;
      const hashedExpectedPassword = passwordHashing(EXPECTED_USER.password);

      const expectedDBUser = {
        id: 2,
        name: 'Blue Pen',
        email: 'bluepen@test.com',
        password: hashedExpectedPassword,
        birthDate: '12.02.1969',
      };

      const userFromDB = await AppDataSource.getRepository(User).findOneBy({ email: expectedResponse.email });

      EXPECTED_USER.password = hashedExpectedPassword;

      //Comparing the sent input to the response without an id
      expect(EXPECTED_USER).to.be.deep.eq(expectedInput);
      //Comparing an User fetched from the Database to an expected User Object
      expect(userFromDB).to.be.deep.eq(expectedDBUser);
    });

    it('Should return an Error when trying to create an User with Invalid Token', async () => {
      const response = await axios.post(
        TEST_URL,
        {
          query: CREATE_USER_MUTATION,
          variables: { data: EXPECTED_USER },
        },
        {
          headers: {
            Authorization: 'bad_token',
          },
        },
      );

      expect(response.data.errors[0]).to.be.deep.eq({
        message: 'Authentication Failed',
        code: 401,
      });
    });
  });

  describe('Existing e-mail checking test', () => {
    it('Should return an error when trying to Sign Up with duplicate e-mail', async () => {
      const response = await axios.post(
        TEST_URL,
        {
          query: CREATE_USER_MUTATION,
          variables: { data: EXPECTED_USER },
        },
        {
          headers,
        },
      );

      expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
    });
  });

  describe('Password validation tests', () => {
    it('Should return an error when trying to Sign Up with a password shorter than 6 chatacters', async () => {
      EXPECTED_USER.password = 'short1';

      const response = await axios.post(
        TEST_URL,
        {
          query: CREATE_USER_MUTATION,
          variables: { data: EXPECTED_USER },
        },
        {
          headers,
        },
      );

      expect(response.data.errors[0]).to.be.deep.eq({
        message: 'Password must contain more than 6 characters',
        code: 401,
      });
    });

    it('Should return an error when trying to Sign Up with a password that only contains number or text', async () => {
      EXPECTED_USER.email = 'redpen@test.com';
      EXPECTED_USER.password = 'password';

      const response = await axios.post(
        TEST_URL,
        {
          query: CREATE_USER_MUTATION,
          variables: { data: EXPECTED_USER },
        },
        {
          headers,
        },
      );

      expect(response.data.errors[0]).to.be.deep.eq({
        message: 'Password must contain at Least 1 Number and 1 Letter',
        code: 401,
      });
    });
  });
});

async function createFirstUser() {
  const user = new User();

  user.name = 'firstUser';
  user.email = 'firstUser@test.com.br';
  user.password = passwordHashing('password123');
  user.birthDate = '02.03.1990';

  await AppDataSource.manager.save(user);
}
