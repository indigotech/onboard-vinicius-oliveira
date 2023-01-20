import { User } from './User';
import { AppDataSource } from './data-source';
import { CustomError } from './test/format-error';
import { checkEmail, checkPassword, checkToken, generateToken, passwordHashing, userRepository } from './utils';

export const resolvers = {
  Query: {
    hello: () => {
      return 'Hello World';
    },
  },
  Mutation: {
    async createUser(_, { data }, context) {
      checkToken(context);

      const user = new User();
      const hashedPassword = passwordHashing(data.password);

      user.name = data.name;
      user.email = data.email;
      user.password = hashedPassword;
      user.birthDate = data.birthDate;

      checkPassword(data.password);
      await checkEmail(data.email);

      await AppDataSource.manager.save(user);
      return user;
    },
  },
};
