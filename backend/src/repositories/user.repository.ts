import { User } from '../models/User.model';
import { RegisterInput } from '../validations/auth.validation';

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }),

  findByEmailWithPassword: (email: string) =>
    User.findOne({ email }).select('+password'),

  findById: (id: string) => User.findById(id),

  create: (payload: RegisterInput) => User.create(payload),
};
