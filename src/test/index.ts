import axios from 'axios';
import assert from 'assert';

describe('GraphQL Hello Query', () => {
  it('returns "Hello World"', async () => {
    const query = `query { hello } `;

    const request = await axios.post('http://localhost:3001/', { query });

    const requestData = request.data;

    assert.equal(requestData.data.hello, 'Hello World');
  });
});
