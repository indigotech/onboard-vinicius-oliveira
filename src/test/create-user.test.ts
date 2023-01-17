import axios from 'axios';
import { expect } from 'chai';
import { EXPECTED_USER, MUTATION, TEST_URL } from './test-constants';

describe('User Tests', () => {
  describe('createUser mutation', () => {
    it('Should create a new user', async () => {
      const response = await axios.post(TEST_URL, {
        query: MUTATION,
        variables: EXPECTED_USER,
      });

      expect(response.data.data.createUser.email).to.be.deep.eq(EXPECTED_USER.data.email);
      expect(response.data.data.createUser.name).to.be.deep.eq(EXPECTED_USER.data.name);
      expect(response.data.data.createUser.birthDate).to.be.deep.eq(EXPECTED_USER.data.birthDate);
    });
  });

  describe('Try to create new User with duplicate e-mail', () => {
    it('Should return an error when trying to Sign Up with duplicate e-mail', async () => {
      const response = await axios.post(TEST_URL, {
        query: MUTATION,
        variables: EXPECTED_USER,
      });

      expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
    });
  });

  describe('Try to create new User with small password', () => {
    it('Should return an error when trying to Sign Up with a password shorter than 6 chatacters', async () => {
      EXPECTED_USER.data.password = 'short1';

      const response = await axios.post(TEST_URL, {
        query: MUTATION,
        variables: EXPECTED_USER,
      });

      expect(response.data.errors[0]).to.be.deep.eq({ message: 'This e-mail is alredy in use', code: 401 });
    });
  });

  describe('Try to create new User with inadequate password', () => {
    it('Should return an error when trying to Sign Up with a password that only contains number or text', async () => {
      EXPECTED_USER.data.email = 'redpen@test.com';
      EXPECTED_USER.data.password = 'password';

      const response = await axios.post(TEST_URL, {
        query: MUTATION,
        variables: EXPECTED_USER,
      });

      expect(response.data.errors[0]).to.be.deep.eq({
        message: 'Password must contain at Least 1 Number and 1 Letter',
        code: 401,
      });
    });
  });
});
