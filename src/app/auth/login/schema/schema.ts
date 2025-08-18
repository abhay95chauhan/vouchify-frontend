import { fieldValidation } from '@/global/utils/validation';
import z from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, { message: fieldValidation('Email') }),
  password: z.string().min(1, { message: fieldValidation('Password') }),
});
