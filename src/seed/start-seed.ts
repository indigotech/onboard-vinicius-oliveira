import { setupDBConnection } from '../data-source';
import * as dotenv from 'dotenv';
import { seedUsers } from './seed-users';

dotenv.config();

export async function startSeed() {
  console.log('\nDatabase Setup Initializing...');
  await setupDBConnection().catch((err) => {
    console.log(err);
  });

  await seedUsers(50);
}

startSeed();
