export type DiscountType = 'Fixed' | 'Percentage';
export type RedeemPerUserType = 'Once' | 'Unlimited';

export interface IVoucherGet {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_redemptions?: number | null;
  max_discount_amount?: number | null;
  redemption_count: number;
  min_order_amount: number;
  start_date: string;
  end_date: string;
  organization_id: string;
  prefix: string;
  postfix?: string;
  redeem_limit_per_user?: RedeemPerUserType;
}

export interface IVoucherPost {
  name: string;
  description?: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_redemptions?: number | null;
  max_discount_amount?: number | null;
  min_order_amount: number;
  start_date: string;
  end_date: string;
  organization_id: string;
  prefix: string;
  postfix?: string;
  redeem_limit_per_user?: RedeemPerUserType;
}

export interface IValidateVoucherPost {
  code: string;
  orderAmount: number;
  currencySymbol?: string;
}
