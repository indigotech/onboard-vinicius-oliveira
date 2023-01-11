import { startApolloServer } from "./server";
import { setupDBConnection } from "./data-source";

async function startApp() {
  console.log("\nDatabase Setup Initializing...");
  await setupDBConnection();

  console.log("\nSetting Up Apollo Server...");
  await startApolloServer();
}

startApp();
