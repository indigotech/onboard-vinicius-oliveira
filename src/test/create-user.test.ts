import axios from 'axios';
import { expect } from 'chai';

describe('createUser mutation', () => {
  it('should create a new user', async () => {
    const mutation = `
    mutation CreateUser($data: UserInput) {
        createUser(data: $data) {
          id
          name
          email
          password
          birthDate
        }
      }
    `;

    const userData = {
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
      variables: userData,
    });

    console.log(JSON.stringify(response.data.errors));
    //end
  });
});
