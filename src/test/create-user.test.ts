import axios from 'axios';
import { expect } from 'chai';

describe('createUser mutation', () => {
  it('should create a new user', async () => {
    const expectedUser = {
      data: {
        name: 'Blue Pen',
        email: 'bluepen@test.com',
        password: 'test123',
        birthDate: '12.02.1969',
      },
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
      variables: expectedUser,
    });

    expect(response.data.data.createUser.email).to.be.deep.eq(expectedUser.data.email);
    expect(response.data.data.createUser.name).to.be.deep.eq(expectedUser.data.name);
    expect(response.data.data.createUser.birthDate).to.be.deep.eq(expectedUser.data.birthDate);
  });
});
