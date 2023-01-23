import { User } from './User';
import { AppDataSource } from './data-source';
import { CustomError } from './test/format-error';
import { checkEmail, checkPassword, checkToken, generateToken, passwordHashing, userRepository } from './utils';

export const resolvers = {
  Query: {
    hello: () => {
      return 'Hello World';
    },
    user: async (_, { id }, context) => {
      await checkToken(context);

      const foundUser = await userRepository.findOneBy({ id: id });

      if (!foundUser) {
        throw new CustomError('User not present in the database', 404);
      }

      return foundUser;
    },
    users: async (_, { limit }, context) => {
      await checkToken(context);

      return await userRepository
        .createQueryBuilder('user')
        .orderBy('user.name')
        .limit(limit || 10)
        .getMany();
    },
  },
  Mutation: {
    async createUser(_, { data }, context) {
      await checkToken(context);

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
    async login(_, { data }) {
      const user = await userRepository.findOneBy({
        email: data.email,
        password: passwordHashing(data.password),
      });

      if (!user) {
        throw new CustomError('User not found, please create an account, or review credentials', 401);
      }

      const token = generateToken(user.id, data.rememberMe);

      return {
        user: user,
        token: token,
      };
    },
  },
};
