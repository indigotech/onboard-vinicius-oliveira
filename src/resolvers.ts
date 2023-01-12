import { User } from './User';
import { AppDataSource } from './data-source';

import crypto from 'crypto';

const userRepository = AppDataSource.getRepository(User);

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    async createUser(_, { data }) {
      const user = new User();

      const hashedPassword = crypto.createHash('sha256').update(data.password).digest('base64');

      user.name = data.name;
      user.email = data.email;
      user.password = hashedPassword;
      user.birthDate = data.birthDate;

      function checkPassword(string) {
        if (string.length < 6) {
          throw new Error('Password must contain More than 6 characters');
        }

        if (!/([0-9].*[a-z])|([a-z].*[0-9])/.test(string)) {
          throw new Error('Password must contain at Least 1 Number and 1 Letter');
        }
      }

      async function checkEmail(inputEmail) {
        if (await userRepository.findOneBy({ email: inputEmail })) {
          throw new Error('This e-mail is alredy in use');
        }
      }

      checkPassword(data.password);
      await checkEmail(data.email);

      await AppDataSource.manager.save(user);
      return user;
    },
  },
};
