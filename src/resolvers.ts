import { User } from './entities/User';
import { Address } from './entities/Address';
import { AppDataSource } from './data-source';
import { CustomError } from './test/format-error';
import {
  addressRepository,
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
    async createUser(_, { input: userInput }, context): Promise<UserOutput> {
      checkToken(context);

      const user = new User();
      const hashedPassword = passwordHashing(userInput.password);

      user.name = userInput.name;
      user.email = userInput.email;
      user.password = hashedPassword;
      user.birthDate = userInput.birthDate;

      checkPassword(userInput.password);
      await checkEmail(userInput.email);

      await AppDataSource.manager.save(user);
      return user;
    },
    async login(_, { input: loginInput }): Promise<LoginOutput> {
      const user = await userRepository.findOneBy({
        email: loginInput.email,
        password: passwordHashing(loginInput.password),
      });

      if (!user) {
        throw new CustomError('User not found, please create an account, or review credentials', 401);
      }

      const token = generateToken(user.id, loginInput.rememberMe);

      return {
        user: user,
        token: token,
      };
    },
    async createAddress(_, { input: addressInput }, context) {
      checkToken(context);

      const user = await userRepository.findOne({
        where: { email: addressInput.userEmail },
        relations: { address: true },
      });

      if (!user) {
        throw new CustomError('User not present in the database', 404);
      }

      const address = new Address();

      address.state = addressInput.state;
      address.city = addressInput.city;
      address.neighborhood = addressInput.neighborhood;
      address.street = addressInput.street;
      address.streetNum = addressInput.streetNum;
      address.cep = addressInput.cep;
      address.complement = addressInput.complement;

      address.user = user;

      if (await userRepository.findOneBy({ address: address })) {
        throw new CustomError('This User is Alredy Registered in this Address', 404);
      }

      await addressRepository.save(address);

      return address;
    },
  },
};
