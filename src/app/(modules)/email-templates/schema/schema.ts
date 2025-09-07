import { fieldValidation } from '@/global/utils/validation';
import z from 'zod';

export const emailTemplateSchema = z.object({
  name: z.string({ message: fieldValidation('Name') }).trim(),
  subject: z.string({ message: fieldValidation('Subject') }).trim(),
  category: z.string().optional(),
  html: z.string({ message: fieldValidation('HTML') }),
});
