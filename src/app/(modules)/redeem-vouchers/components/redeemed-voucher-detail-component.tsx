'use client';

import type React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Barcode,
  Building2,
  CalendarClock,
  ExternalLink,
  Mail,
  Monitor,
  Network,
  Percent,
  Receipt,
  Ticket,
  User,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IVoucherRedemptionGet } from '../model-interfaces/interfaces';
import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import VoucherCodeCopyComponent from '../../vouchers/components/voucher-code-copy';
import moment from 'moment';
import { voucherRedeemStatus } from '../helpers/config';
import { discountSymbol, discountType } from '../../vouchers/helpers/config';
import { DiscountType } from '../../vouchers/interface-model/interfaces';
import { useAppSelector } from '@/redux/hook';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { PageHeader } from '@/global/components/page-header/page-header';

export function VoucherRedemptionDetailComponent({
  redemption,
}: {
  redemption: IVoucherRedemptionGet;
}) {
  const voucherName = redemption.voucher?.name ?? 'Voucher';
  const voucherCode = redemption.voucher?.code;
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <PageHeader
          backRedirectUrl='/redeem-vouchers'
          showBackButton
          title={
            <div className='flex items-center gap-2'>
              <Typography.H3>{voucherName}</Typography.H3>
              <VoucherCodeCopyComponent code={voucherCode} />
              <a
                href={`/vouchers/${redemption.voucher.code}`}
                target='_blank'
                className='text-blue-600'
                aria-label='Open voucher'
              >
                <ExternalLink className='h-3 w-3' />
              </a>
            </div>
          }
        />

        <Badge
          className={cn(
            voucherRedeemStatus.success === redemption.status
              ? 'bg-success'
              : 'bg-destructive',
            'w-18 h-8'
          )}
        >
          {redemption.status}
        </Badge>
      </div>

      <CardComponent cardContentClass='space-y-6'>
        {/* Amounts */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <CardComponent cardClass='bg-secondary'>
            <Typography.Muted>
              <span className='inline-flex h-6 w-6 mr-2 items-center justify-center rounded-md bg-background'>
                {user.organization.currency_symbol}
              </span>
              Order Amount
            </Typography.Muted>
            <Typography.H3>
              {discountSymbol[discountType[0] as DiscountType]({
                currency: user.organization.currency_symbol,
                amount: redemption.order_amount,
              })}
            </Typography.H3>
          </CardComponent>
          <CardComponent cardClass='bg-secondary'>
            <Typography.Muted className='space-x-2'>
              <span className='inline-flex h-6 w-6 mr-2 items-center justify-center rounded-md bg-background'>
                <Percent className='h-3.5 w-3.5' />
              </span>
              Discount
            </Typography.Muted>
            <Typography.H3>
              {discountSymbol[discountType[0] as DiscountType]({
                currency: user.organization.currency_symbol,
                amount: redemption.discount_amount,
              })}
            </Typography.H3>
          </CardComponent>
          <CardComponent cardClass='bg-secondary'>
            <Typography.Muted>
              <span className='inline-flex h-6 w-6 mr-2 items-center justify-center rounded-md bg-background'>
                <Wallet className='h-3.5 w-3.5' />
              </span>
              Final Payable
            </Typography.Muted>
            <Typography.H3>
              {discountSymbol[discountType[0] as DiscountType]({
                currency: user.organization.currency_symbol,
                amount: redemption.final_payable_amount,
              })}
            </Typography.H3>
          </CardComponent>
        </div>

        {/* Details grid */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <DetailRow
            icon={User}
            label='Customer Name'
            value={redemption.user_name || '—'}
          />
          <DetailRow
            icon={Mail}
            label='Customer Email'
            value={redemption.user_email || '—'}
          />
          <DetailRow
            icon={Receipt}
            label='Order ID'
            value={redemption.order_id || '—'}
          />
          <DetailRow
            icon={Network}
            label='IP Address'
            value={redemption.ip_address || '—'}
          />
          <DetailRow
            icon={Monitor}
            label='Platform'
            value={redemption.user_agent || '—'}
          />
          <DetailRow
            icon={Building2}
            label='Organization ID'
            value={redemption.organization_id}
            showCopyBtn
          />
          <DetailRow
            icon={Ticket}
            label='Voucher ID'
            value={redemption.voucher_id}
            showCopyBtn
          />
          <DetailRow
            icon={Barcode}
            label='Redemption ID'
            value={redemption.id}
            showCopyBtn
          />
          <DetailRow
            icon={CalendarClock}
            label='Redeemed'
            value={moment(redemption.created_at).format('lll')}
          />
        </div>
      </CardComponent>
    </div>
  );
}

function DetailRow({
  label,
  value,
  showCopyBtn,
  icon: Icon,
}: {
  label: string;
  value: string;
  showCopyBtn?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex items-center gap-2'>
        <Icon className='h-3.5 w-3.5 text-foreground' />
        <Typography.Muted>{label}</Typography.Muted>
      </div>
      <div className='flex gap-2 items-center'>
        <Typography.H6>{value}</Typography.H6>
        {showCopyBtn ? (
          <CopyButton content={value} variant='outline' size='sm' />
        ) : null}
      </div>
    </div>
  );
}
