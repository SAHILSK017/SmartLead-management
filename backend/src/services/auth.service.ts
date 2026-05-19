import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { IUserPublic, JwtPayload, UserRole } from '../types';
import { RegisterInput, LoginInput } from '../validations/auth.validation';
import { userRepository } from '../repositories/user.repository';

const signToken = (userId: string, role: UserRole): string => {
  const payload: JwtPayload = { userId, role };
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const registerUser = async (
  input: RegisterInput
): Promise<{ token: string; user: IUserPublic }> => {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  const user = await userRepository.create(input);
  const token = signToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

export const loginUser = async (
  input: LoginInput
): Promise<{ token: string; user: IUserPublic }> => {
  const user = await userRepository.findByEmailWithPassword(input.email);
  if (!user || !(await user.comparePassword(input.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

export const getMe = async (userId: string): Promise<IUserPublic> => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};
