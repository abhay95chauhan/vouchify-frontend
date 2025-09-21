import { IVoucherRedemptionGet } from './interfaces';

export class VoucherRedemptionGetModel implements IVoucherRedemptionGet {
  id!: string;
  voucher_id!: string;
  organization_id!: string;
  order_amount!: number;
  discount_amount!: number;
  final_payable_amount!: number;
  status!: 'Success' | 'Refunded';
  created_at!: Date;
  updated_at!: Date;
  user_name?: string;
  user_email?: string;
  order_id?: string;
  ip_address?: string;
  user_agent?: string;

  constructor(data?: IVoucherRedemptionGet) {
    Object.assign(this, data);
  }
}
