import { User } from './User';
import { AppDataSource } from './data-source';
import crypto from 'crypto';
import { CustomError } from './test/format-error';

const userRepository = AppDataSource.getRepository(User);

export const resolvers = {
  Query: {
    hello: () => {
      return 'Hello World';
    },
  },
  Mutation: {
    async createUser(_, { data }) {
      const user = new User();
      const hashedPassword = passwordHashing(data.password);

      user.name = data.name;
      user.email = data.email;
      user.password = hashedPassword;
      user.birthDate = data.birthDate;

      await checkPassword(data.password);
      await checkEmail(user.email);

      await AppDataSource.manager.save(user);
      return user;
    },
  },
};

async function checkPassword(password: string) {
  if (password.length < 6) {
    throw new CustomError('Password must contain more than 6 characters', 401);
  }

  const regex = /([0-9].*[a-z])|([a-z].*[0-9])/;

  if (!regex.test(password)) {
    throw new CustomError('Password must contain at Least 1 Number and 1 Letter', 401);
  }
}

async function checkEmail(inputEmail: string) {
  if (await userRepository.findOneBy({ email: inputEmail })) {
    throw new CustomError('This e-mail is alredy in use', 401);
  }
}

export function passwordHashing(password: string) {
  return crypto.createHash('sha256').update(password).digest('base64');
}
