import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { passwordHashing } from '../resolvers';
import { User } from '../User';
import { EXPECTED_USER, MUTATION, TEST_URL } from './test-constants';

describe('User Tests', () => {
  describe('createUser mutation', () => {
    it('Should create a new user', async () => {
      const expectedUser = {
        name: 'Blue Pen',
        email: 'bluepen@test.com',
        password: 'test123',
        birthDate: '12.02.1969',
      };

      const response = await axios.post(`http://localhost:3001/`, {
        query: `
  mutation CreateUser($data: UserInput) {
      createUser(data: $data) {
        id
        name
        email
        password
        birthDate
      }
    }
  `,
        variables: { data: expectedUser },
      });
      const { id, ...expectedResponse } = response.data.data.createUser;

      const hashedPassword = passwordHashing(expectedUser.password);

      const userFromDB = await AppDataSource.getRepository(User).findOneBy({ email: expectedUser.email });

      expect(userFromDB.email).to.be.deep.eq(expectedUser.email);

      expect(expectedResponse).to.be.deep.eq({
        name: expectedUser.name,
        email: expectedUser.email,
        password: hashedPassword,
        birthDate: expectedUser.birthDate,
      });
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
