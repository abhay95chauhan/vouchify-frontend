import moment from 'moment-timezone';
import { DiscountType, RedeemPerUserType } from '../interface-model/interfaces';

export const discountType: DiscountType[] = ['Fixed', 'Percentage'];
export const redeemPerUser: RedeemPerUserType[] = ['Once', 'Unlimited'];

export const discountSymbol = {
  Fixed: ({ amount, currency }: { amount?: number; currency?: string }) =>
    `${currency ?? ''} ${amount ?? ''}`,
  Percentage: ({ amount }: { amount?: number }) => `${amount ?? ''} %`,
  'Gift Card': ({ amount }: { amount?: number }) => `${amount ?? ''} %`,
};

export function checkVoucherStatus(
  startDate: string,
  endDate: string,
  tz: string
) {
  const today = moment.tz(tz)?.startOf('day'); // normalize
  const start = moment.tz(startDate, tz)?.startOf('day');
  const end = moment.tz(endDate, tz)?.endOf('day'); // include full end day

  if (today?.isBefore(start)) {
    return { isActive: 'Inactive', status: false };
  } else if (today?.isAfter(end)) {
    return { isActive: 'Expired', status: false };
  } else {
    return { isActive: 'Active', status: true }; // ✅ fallback
  }
}

export function generateVoucher(
  length: number = 10,
  prefix: string = ''
): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return prefix ? `${prefix}-${code}` : code;
}

export function buildVoucherCode(
  prefix?: string,
  code?: string,
  postfix?: string
) {
  return [prefix, code, postfix].filter(Boolean).join('-');
}
