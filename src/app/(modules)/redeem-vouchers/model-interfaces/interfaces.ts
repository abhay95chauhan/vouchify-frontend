import { IVoucherGet } from '../../vouchers/interface-model/interfaces';

export interface IVoucherRedemptionGet {
  id: string;
  voucher_id: string;
  voucher: IVoucherGet;
  organization_id: string;
  user_name?: string;
  user_email?: string;
  order_id?: string;
  order_amount: number;
  discount_amount: number;
  final_payable_amount: number;
  ip_address?: string;
  user_agent?: string;
  status: 'Success' | 'Refunded'; // type-safe enum
  created_at: Date;
  updated_at: Date;
}
