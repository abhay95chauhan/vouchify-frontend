export interface IDashboardGet {
  total_vouchers: number;
  active_vouchers?: number;
  expired_vouchers?: number;
  upcoming_vouchers?: number;
  total_redeemed_vouchers?: number;
}
