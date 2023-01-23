import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { dropDB, setupDBConnection } from './data-source';
import { User } from './User';
import { passwordHashing, userRepository } from './utils';

dotenv.config({ path: __dirname + '/../test.env' });

function randomUser(): User {
  const user = new User();

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  user.name = firstName + ' ' + lastName;
  user.email = faker.internet.email(faker.internet.userName(firstName, lastName));
  user.password = passwordHashing(faker.internet.password());
  user.birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toLocaleDateString('pt-BR');

  return user;
}

async function populateDb(userPopulation: number) {
  for (let index = 0; index < userPopulation; index++) {
    const newUser = randomUser();

    await userRepository.save(newUser);
  }
}

export async function startSeed() {
  console.log('\nDatabase Setup Initializing...');
  await setupDBConnection();

  await populateDb(50);

  dropDB();
}

startSeed();
