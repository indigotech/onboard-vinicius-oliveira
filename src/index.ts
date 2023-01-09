import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "graphql";

// A schema is a collection of type definitions that together define the "shape" of queries that are executed against your data.
const typeDefs = buildSchema(`

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. 

type Query {
    hello: String!
}
`);

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

// The ApolloServer constructor requires two parameters: your schema and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The StartStandaloneServer function accepts two arguments: the first is an instance of ApolloServer,
// and the second and optional argument is for configuring server options,
// check properties in (https://www.apollographql.com/docs/apollo-server/api/standalone/)
const { url } = await startStandaloneServer(server, {
  listen: { port: 3001 },
});

console.log(`Server running at: ${url}`);
