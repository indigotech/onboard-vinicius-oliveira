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
import { LoginOutput, UserOutput, UsersPagination } from './interfaces';

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
    users: async (_, { usersByPage, page }, context): Promise<UsersPagination> => {
      checkToken(context);

      usersByPage = usersByPage ? usersByPage : 10;

      if (page <= 0 || !page) {
        throw new CustomError('Page number must be an Integer greater than 0', 400);
      }

      const totalUsers = await getTotalUsersDb();

      const pageNum = Math.ceil(totalUsers / usersByPage);
      const before = usersByPage * (page - 1);

      const after = totalUsers - (before + usersByPage);

      if (page > pageNum) {
        return {
          total: totalUsers,
          after: 0,
          before: totalUsers,
          users: [],
        };
      }

      const users = await userRepository
        .createQueryBuilder('user')
        .orderBy('user.name')
        .skip(before)
        .take(usersByPage)
        .getMany();

      return {
        total: totalUsers,
        after: after < 0 ? 0 : after,
        before: before,
        users: users,
      };
    },
  },
  Mutation: {
    async createUser(_, { data }, context): Promise<UserOutput> {
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
    async login(_, { data }): Promise<LoginOutput> {
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
