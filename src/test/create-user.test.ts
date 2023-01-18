import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../User';
import { DEFAULT_USER, CREATE_USER_MUTATION, TEST_URL } from './test-constants';

describe('User Tests', () => {
  describe('createUser mutation', () => {
    it('Should create a new user', async () => {
      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: DEFAULT_USER },
      });

      const { id, ...expectedResponse } = response.data.data.createUser;

      const userFromDB = await AppDataSource.getRepository(User).findOneBy({ email: expectedResponse.email });

      expect(userFromDB.email).to.be.deep.eq(DEFAULT_USER.email);

      expect(expectedResponse).to.be.deep.eq({
        name: userFromDB.name,
        email: userFromDB.email,
        password: userFromDB.password,
        birthDate: userFromDB.birthDate,
      });
    });
  });

  describe('Existing e-mail checking test', () => {
    it('Should return an error when trying to Sign Up with duplicate e-mail', async () => {
      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: DEFAULT_USER },
      });

      expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
    });
  });

  describe('Password validation tests', () => {
    it('Should return an error when trying to Sign Up with a password shorter than 6 chatacters', async () => {
      DEFAULT_USER.password = 'short1';

      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: DEFAULT_USER },
      });

      expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
    });

    it('Should return an error when trying to Sign Up with a password that only contains number or text', async () => {
      DEFAULT_USER.email = 'redpen@test.com';
      DEFAULT_USER.password = 'password';

      const response = await axios.post(TEST_URL, {
        query: CREATE_USER_MUTATION,
        variables: { data: DEFAULT_USER },
      });

      expect(response.data.errors[0]).to.be.deep.eq({
        message: 'Password must contain at Least 1 Number and 1 Letter',
        code: 401,
      });
    });
  });
});
