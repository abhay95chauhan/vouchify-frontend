import { fieldValidation } from '@/global/utils/validation';
import z from 'zod';

export const organizationSchema = z.object({
  name: z.string({ message: fieldValidation("Organization's Name") }),
  industry: z.string({ message: fieldValidation('Industry') }),
  organization_type: z.string({ message: fieldValidation('Type') }),
  currency: z.string({ message: fieldValidation('Currency') }),
  timezone: z.string({ message: fieldValidation('Timezone') }),
  website: z.url().optional(),
  description: z.string().optional(),
});
