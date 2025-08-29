import { fieldValidation } from '@/global/utils/validation';
import z from 'zod';

export const smtpSchema = z.object({
  sender_email: z
    .string({ message: fieldValidation('Sender Email') })
    .email({ message: 'Invalid Email' }),
  sender_name: z.string({ message: fieldValidation('Sender Name') }),
  host: z.string({ message: fieldValidation('Host') }),
  port: z.number({ message: fieldValidation('Port') }),
  username: z.string({ message: fieldValidation('Username') }),
  password: z.string({ message: fieldValidation('Password') }),
});
