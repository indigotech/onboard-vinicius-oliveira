"use strict";
exports.__esModule = true;
var server_1 = require("@apollo/server");
var standalone_1 = require("@apollo/server/standalone");
var graphql_1 = require("graphql");
var typeDefs = graphql_1.buildSchema("\ntype Query {\n    hello: String!\n}\n");
var resolvers = {
    Query: {
        hello: function () { return "Hello World!"; }
    }
};
var server = new server_1.ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
var url = standalone_1.startStandaloneServer(server, {
    listen: { port: 3001 }
});
console.log("Server running at: " + url);
