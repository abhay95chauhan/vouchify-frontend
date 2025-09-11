import { fieldValidation } from '@/global/utils/validation';
import z from 'zod';

export const smtpSchema = z.object({
  sender_email: z
    .string({ message: fieldValidation('Sender Email') })
    .email({ message: 'Invalid Email' })
    .trim(),
  sender_name: z.string({ message: fieldValidation('Sender Name') }).trim(),
  host: z.string({ message: fieldValidation('Host') }).trim(),
  port: z.number({ message: fieldValidation('Port') }),
  username: z.string({ message: fieldValidation('Username') }),
  password: z.string({ message: fieldValidation('Password') }),
});

export const sendEmailToRecipients = z.object({
  emails: z
    .array(
      z
        .string({ message: fieldValidation('Emails') })
        .email({ message: 'Invalid Email' })
        .trim()
    )
    .nonempty({ message: 'At least one email is required' }),
});
