import z from 'zod';

export const voucherRedeemedFilterSchema = z.object({
  voucher_id: z
    .array(
      z.object({
        label: z.string().optional(),
        value: z.string().nullable().optional(),
      })
    )
    .nullable() // allow `null`
    .optional(), // allow `undefined`

  status: z.string().optional(),
  order_amount: z.object({
    op: z.string().optional(),
    value: z.string().optional(),
  }),
  discount_amount: z.object({
    op: z.string().optional(),
    value: z.string().optional(),
  }),
  final_payable_amount: z.object({
    op: z.string().optional(),
    value: z.string().nullable().optional(), // null if unlimited
  }),
});

export type voucherRedeemedFilterForm = z.infer<
  typeof voucherRedeemedFilterSchema
>;
