import axios from 'axios';
import {} from 'mocha';
import { expect } from 'chai';

describe('GraphQL Hello Query', () => {
  it('returns "Hello World"', async () => {
    const query = `query { hello } `;

    const request = await axios.post('http://localhost:3001/', { query });

    const queryResponseField = request.data.data.hello;

    expect(queryResponseField).to.be.deep.eq('Hello World');
  });
});
