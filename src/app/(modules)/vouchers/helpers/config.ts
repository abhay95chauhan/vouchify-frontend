import moment from 'moment-timezone';

export const discountType = ['Fixed', 'Percentage'];
export const redeemPerUser = ['Once', 'Unlimited'];

export const discountSymbol = {
  Fixed: (currency: string) => currency,
  Percentage: () => '%',
  'Gift Card': () => '%',
};

export function checkVoucherStatus(
  startDate: string,
  endDate: string,
  tz: string
) {
  const today = moment.tz(tz)?.startOf('day'); // normalize to same day start
  const start = moment(startDate, 'YYYY-MM-DD').tz(tz);
  const end = moment(endDate, 'YYYY-MM-DD').tz(tz);

  if (today?.isBefore(start)) {
    return {
      isActive: 'Inactive',
      status: false,
    };
  } else if (today.isAfter(end)) {
    return {
      isActive: 'Expired',
      status: false,
    };
  } else if (today?.isBetween(start, end, undefined, '[)')) {
    return {
      isActive: 'Active',
      status: true,
    };
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
