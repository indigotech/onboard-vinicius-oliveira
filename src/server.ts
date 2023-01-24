import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from '@apollo/server';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { formatError } from './test/format-error';

export const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers, formatError });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) },

    context: async ({ req }) => {
      const headers = req.headers;
      return { headers };
    },
  });

  console.log(`Server running at: localhost:${url}`);
};
