import { User } from './User';
import { AppDataSource } from './data-source';
import crypto from 'crypto';
import { CustomError } from './test/format-error';
import jwt from 'jsonwebtoken';
import { JWTpayload } from './interfaces';

export const userRepository = AppDataSource.getRepository(User);

export function checkPassword(password: string) {
  if (password.length < 7) {
    throw new CustomError('Password must contain more than 6 characters', 401);
  }

  const regex = /([0-9].*[a-z])|([a-z].*[0-9])/;

  if (!regex.test(password)) {
    throw new CustomError('Password must contain at Least 1 Number and 1 Letter', 401);
  }
}

export async function checkEmail(inputEmail: string) {
  if (await userRepository.findOneBy({ email: inputEmail })) {
    throw new CustomError('This e-mail is alredy in use', 401);
  }
}

export function passwordHashing(password: string) {
  return crypto.createHash('sha256').update(password).digest('base64');
}

export function generateToken(userId: number, rememberMe: boolean) {
  return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET, { expiresIn: rememberMe === true ? '7d' : '1d' });
}

export function checkToken(context) {
  const token = context.headers.authorization;

  if (!token) {
    throw new CustomError('Authentication Failed', 401, 'No token Found');
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET) as JWTpayload;
  } catch (err) {
    throw new CustomError('Authentication Failed', 401);
  }
}

export const getTotalUsersDb = () => {
  return AppDataSource.manager.count(User);
};
