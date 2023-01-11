import { setupDBConnection } from "./data-source";
import { startApolloServer } from "./server";

// ##TODO: async programing -> Database has to start first, so the server Setup can be executed
setupDBConnection();
startApolloServer();
