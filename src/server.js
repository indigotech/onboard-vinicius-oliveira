const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");

// GraphQL Schema
const schema = buildSchema(`
    type Query {
        hello: String!
    }
`);

// GraphQL Root Resolver
const root = {
  hello: () => "Hello World!",
};

// Setting Up the Express Server & GraphQL endpoint

const app = express();

app.use(
  "/graphql",
  express_graphql.graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server Running On localhost:${PORT}/graphql`);
});
