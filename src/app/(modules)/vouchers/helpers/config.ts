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
  const start = moment(startDate, 'YYYY-MM-DD');
  const end = moment(endDate, 'YYYY-MM-DD');

  return {
    isActive: today?.isBetween(start, end, undefined, '[]')
      ? 'Active'
      : 'Inactive',
    status: today?.isBetween(start, end, undefined, '[]') ? true : false,
  };
}
