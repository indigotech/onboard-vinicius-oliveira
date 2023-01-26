import { dropDb, setupDBConnection } from './data-source';
import { startApolloServer } from './server';

export async function startApp() {
  await dropDb();

  console.log('\nDatabase Setup Initializing...');
  await setupDBConnection();

  console.log('\nSetting Up Apollo Server...');
  await startApolloServer();
}
