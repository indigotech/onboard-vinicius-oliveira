import { User } from './User';
import { AppDataSource } from './data-source';

const userRepository = AppDataSource.getRepository(User);

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

      checkPassword(data.password);
      await checkEmail(data.email);

      await AppDataSource.manager.save(user);
      return user;
    },
  },
};

function checkPassword(string) {
  if (string.length < 6) {
    throw new Error('Password must contain More than 6 characters');
  }

  const regex = /([0-9].*[a-z])|([a-z].*[0-9])/;

  if (!regex.test(string)) {
    throw new Error('Password must contain at Least 1 Number and 1 Letter');
  }
}

async function checkEmail(inputEmail) {
  if (await userRepository.findOneBy({ email: inputEmail })) {
    throw new Error('This e-mail is alredy in use');
  }
}
