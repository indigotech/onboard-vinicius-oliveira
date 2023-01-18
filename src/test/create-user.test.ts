import axios from 'axios';
import { expect } from 'chai';
import { passwordHashing } from '../resolvers';
import { AppDataSource } from '../data-source';
import { User } from '../User';
import { EXPECTED_USER, CREATE_USER_MUTATION, TEST_URL } from './test-constants';

describe('User Tests', () => {
  describe('createUser mutation', () => {
    it('Should create a new user', async () => {
      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: EXPECTED_USER },
      });

      const expectedResponse = response.data.data.createUser;
      const { id, ...expectedInput } = response.data.data.createUser;
      const hashedExpectedPassword = passwordHashing(EXPECTED_USER.password);

      const expectedDBUser = {
        id: 1,
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
  });

  describe('Existing e-mail checking test', () => {
    it('Should return an error when trying to Sign Up with duplicate e-mail', async () => {
      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: EXPECTED_USER },
      });

      expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
    });
  });

  describe('Password validation tests', () => {
    it('Should return an error when trying to Sign Up with a password shorter than 6 chatacters', async () => {
      EXPECTED_USER.password = 'short1';

      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: EXPECTED_USER },
      });

      expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
    });

    it('Should return an error when trying to Sign Up with a password that only contains number or text', async () => {
      EXPECTED_USER.email = 'redpen@test.com';
      EXPECTED_USER.password = 'password';

      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: EXPECTED_USER },
      });

      expect(response.data.errors[0]).to.be.deep.eq({
        message: 'Password must contain at Least 1 Number and 1 Letter',
        code: 401,
      });
    });
  });
});
