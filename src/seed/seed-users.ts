import { faker } from '@faker-js/faker';
import { User } from '../entities/User';
import { passwordHashing, userRepository } from '../utils';

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

export async function seedUsers(userPopulation: number) {
  const users = [];
  for (let index = 0; index < userPopulation; index++) {
    const newUser = randomUser();

    users.push(newUser);
  }

  await userRepository.save(users);
}
