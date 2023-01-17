export const EXPECTED_USER = {
  data: {
    name: 'Blue Pen',
    email: 'bluepen@test.com',
    password: 'test123',
    birthDate: '12.02.1969',
  },
};

export const TEST_URL = 'http://localhost:3001/';

export const MUTATION = `
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
