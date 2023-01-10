import { AppDataSource } from "./data-source";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "graphql";

const typeDefs = buildSchema(`
type Query {
    hello: String!
}
`);

const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const url = startStandaloneServer(server, {
  listen: { port: 3001 },
});

console.log(`Server running at: ${url}`);
