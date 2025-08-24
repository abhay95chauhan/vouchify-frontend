import { DiscountType, IVoucherPost, RedeemPerUserType } from './interfaces'; // your IVoucherPost path

export class VoucherModelPost implements IVoucherPost {
  name: string;
  description?: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_redemptions?: number | null;
  min_order_amount: number;
  start_date: string;
  end_date: string;
  organization_id: string;
  prefix: string;
  postfix?: string;
  redeem_limit_per_user?: RedeemPerUserType;

  constructor(data?: Partial<IVoucherPost>) {
    this.name = data?.name ?? '';
    this.description = data?.description ?? '';
    this.code = data?.code ?? '';
    this.discount_type = data?.discount_type ?? 'Percentage'; // default if you want
    this.discount_value = data?.discount_value ?? 0;
    this.max_redemptions = data?.max_redemptions ?? null;
    this.min_order_amount = data?.min_order_amount ?? 0;
    this.start_date = data?.start_date ?? '';
    this.end_date = data?.end_date ?? '';
    this.organization_id = data?.organization_id ?? '';
    this.prefix = data?.prefix ?? '';
    this.postfix = data?.postfix ?? '';
    this.redeem_limit_per_user = data?.redeem_limit_per_user ?? 'Once'; // optional default
  }
}
