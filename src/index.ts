import { setupDBConnection } from "./data-source";
import { startApolloServer } from "./server";

setupDBConnection();
startApolloServer();
