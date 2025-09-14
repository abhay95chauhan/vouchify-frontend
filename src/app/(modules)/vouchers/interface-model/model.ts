import { DiscountType, IVoucherPost, RedeemPerUserType } from './interfaces'; // your IVoucherPost path

export class VoucherModelPost implements IVoucherPost {
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
  eligible_products?: string[];
  last_redeemed_at?: Date | null;

  constructor(data?: Partial<IVoucherPost>) {
    this.name = data?.name ?? '';
    this.description = data?.description ?? '';
    this.code = data?.code ?? '';
    this.discount_type = data?.discount_type ?? 'Percentage'; // default if you want
    this.discount_value = data?.discount_value ?? 0;
    this.max_redemptions = data?.max_redemptions ?? null;
    this.max_discount_amount = data?.max_discount_amount ?? null;
    this.min_order_amount = data?.min_order_amount ?? 0;
    this.start_date = data?.start_date ?? '';
    this.end_date = data?.end_date ?? '';
    this.organization_id = data?.organization_id ?? '';
    this.prefix = data?.prefix ?? '';
    this.postfix = data?.postfix ?? '';
    this.redeem_limit_per_user = data?.redeem_limit_per_user ?? 'Once'; // optional default
    this.eligible_products = data?.eligible_products ?? []; // optional default
    this.last_redeemed_at = data?.last_redeemed_at ?? null; // optional default
  }
}
