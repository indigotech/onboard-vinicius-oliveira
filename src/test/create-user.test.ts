import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../User';
import { passwordHashing } from '../resolvers';

describe('createUser mutation', () => {
  it('should create a new user', async () => {
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
