import axios from 'axios';
import { expect } from 'chai';

describe('GraphQL Hello Query', () => {
  it('should "Hello World"', async () => {
    const query = `query { hello } `;

    const request = await axios.post(`http://localhost:${process.env.PORT}/`, { query });

    const queryResponseField = request.data;

    expect(queryResponseField).to.be.deep.eq({ data: { hello: 'Hello World' } });
  });
});
