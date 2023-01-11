import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from '@apollo/server';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';

export const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const PORT = 3001;

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`Server running at: localhost:${url}`);
};
