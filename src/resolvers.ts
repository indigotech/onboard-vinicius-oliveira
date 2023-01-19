import { User } from './User';
import { AppDataSource } from './data-source';
import crypto from 'crypto';
import { CustomError } from './test/format-error';
import jwt from 'jsonwebtoken';

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

const userRepository = AppDataSource.getRepository(User);

function checkPassword(password: string) {
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

const TOKEN_SECRET = 'May the F0rc3 be w!th you';

export function generateToken(userId: number, rememberMe: boolean) {
  return jwt.sign({ userId: userId }, TOKEN_SECRET, { expiresIn: rememberMe === true ? '7d' : '1d' });
}
