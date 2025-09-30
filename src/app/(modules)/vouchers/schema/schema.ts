import { z } from 'zod';
import { discountType, redeemPerUser } from '../helpers/config';
import { fieldValidation } from '@/global/utils/validation';

const IsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected date in YYYY-MM-DD format');

/** Coerce numeric fields from strings if needed */

/** Core schema matching IVoucherPost */
export const VoucherPostSchema = z
  .object({
    name: z
      .string(fieldValidation('Voucher Name'))
      .trim()
      .min(1, fieldValidation('Voucher Name'))
      .trim(),
    description: z.string().trim().optional(),

    code: z
      .string(fieldValidation('Code'))
      .trim()
      .min(1, fieldValidation('Code')),

    discount_type: z
      .string(fieldValidation('Discount Type'))
      .min(1, fieldValidation('Discount Type'))
      .default(discountType[1]),

    discount_value: z
      .number(fieldValidation('Value'))
      .min(1, 'Value is required'),

    max_redemptions: z.number().nullable().optional(),
    max_discount_amount: z.number().optional(),

    min_order_amount: z
      .number(fieldValidation('Minimun Order Amount'))
      .min(0, fieldValidation('Minimun Order Amount')),

    start_date: IsoDate,
    end_date: IsoDate,

    prefix: z.string().trim().optional(),

    postfix: z.string().trim().optional(),

    redeem_limit_per_user: z
      .string(fieldValidation('User Redeem Limit'))
      .min(1, fieldValidation('User Redeem Limit'))
      .default(redeemPerUser[0]),
  })
  .superRefine((val, ctx) => {
    // start_date <= end_date
    const s = new Date(val.start_date);
    const e = new Date(val.end_date);
    if (isFinite(s.getTime()) && isFinite(e.getTime()) && s > e) {
      ctx.addIssue({
        code: 'custom',
        path: ['end_date'],
        message: 'end_date must be on or after start_date.',
      });
    }
  });

export const validateVoucherPostSchema = z.object({
  code: z
    .string(fieldValidation('Voucher Code'))
    .trim()
    .min(1, fieldValidation('Voucher Code')),

  email: z.string().trim().optional(),
  orderAmount: z
    .number(fieldValidation('Amount'))
    .min(1, fieldValidation('Amount')),
});

// schema/filter-schema.ts

export const vouchersFilterSchema = z.object({
  discount_type: z.string().optional(),
  redeem_limit_per_user: z.string().optional(),
  min_order_amount: z.object({
    op: z.string().optional(),
    value: z.string().optional(),
  }),
  max_discount_amount: z.object({
    op: z.string().optional(),
    value: z.string().optional(),
  }),
  discount_value: z.object({
    op: z.string().optional(),
    value: z.string().optional(),
  }),
  redemption_count: z.object({
    op: z.string().optional(),
    value: z.string().optional(),
  }),
  max_redemptions: z.object({
    op: z.string().optional(),
    value: z.string().nullable().optional(), // null if unlimited
  }),
  date_range: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

export type VouchersFilterForm = z.infer<typeof vouchersFilterSchema>;
