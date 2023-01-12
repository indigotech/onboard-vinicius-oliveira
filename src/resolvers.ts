import { User } from './User';
import { AppDataSource } from './data-source';

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    async createUser(_, { data }) {
      const user = new User();

      user.name = data.name;
      user.email = data.email;
      user.password = data.password;
      user.birthDate = data.birthDate;

      await AppDataSource.manager.save(user);
      return user;
    },
  },
};
