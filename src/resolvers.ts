import { User } from './User';
import { AppDataSource } from './data-source';
import { CustomError } from './test/format-error';
import {
  checkEmail,
  checkPassword,
  checkToken,
  generateToken,
  getTotalUsersDb,
  passwordHashing,
  userRepository,
} from './utils';
import { UsersPagination } from 'interfaces';

export const resolvers = {
  Query: {
    hello: () => {
      return 'Hello World';
    },
    user: async (_, { id }, context) => {
      checkToken(context);

      const foundUser = await userRepository.findOneBy({ id: id });

      if (!foundUser) {
        throw new CustomError('User not present in the database', 404);
      }

      return foundUser;
    },
    users: async (_, { usersByPage, page }, context) => {
      checkToken(context);

      if (!usersByPage) {
        usersByPage = 10;
      }

      const totalUsers = await getTotalUsersDb();

      const pageNum = Math.ceil(totalUsers / usersByPage);
      const tagetPage = usersByPage * (page - 1);

      const after = totalUsers - (tagetPage + usersByPage);

      if (page <= 0) {
        throw new CustomError('Page number must be greater than 0', 401);
      }

      if (page > pageNum) {
        throw new CustomError('Page number exceeded', 401);
      }

      const users = await userRepository
        .createQueryBuilder('user')
        .orderBy('user.name')
        .skip(tagetPage)
        .take(usersByPage)
        .getMany();

      return {
        location: `Page ${page} of ${pageNum}`,
        total: totalUsers,
        after: after,
        before: tagetPage,
        users: users,
      };
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
