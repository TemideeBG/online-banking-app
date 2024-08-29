import * as jwt from 'jsonwebtoken';
import { UserInfoInterface } from '../interfaces/user_info.interface';
import { Payload } from '../types/payload';

const createJWT = (user: UserInfoInterface): string => {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return token;
};

const isTokenValid = (token: string): Payload | null => {
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Payload;
      return decoded;
  } catch (error) {
      console.error('Error verifying token:', error);
      return null;
  }
};

export {
    createJWT,
    isTokenValid
  };