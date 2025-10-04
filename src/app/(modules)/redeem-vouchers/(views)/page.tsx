'use client';
import CardComponent from '@/global/components/card/card-component';
import { TableSkeleton } from '@/global/components/list-view/list-view-skeleton-loader';
import { PageHeader } from '@/global/components/page-header/page-header';
import React, { Suspense } from 'react';
import ListViewComponent from '@/global/components/list-view/list-view';
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table';
import { IVoucherRedemptionGet } from '../model-interfaces/interfaces';
import { Badge } from '@/components/ui/badge';
import { discountSymbol, discountType } from '../../vouchers/helpers/config';
import { DiscountType } from '../../vouchers/interface-model/interfaces';
import { useAppSelector } from '@/redux/hook';
import { getUserAgentDeviceInfo } from '../../account/helpers/config';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Typography } from '@/global/components/typography/typography';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { voucherRedeemStatus } from '../helpers/config';
import { cn } from '@/lib/utils';

const RedeemedVouchersList = () => {
  const { user } = useAppSelector((state) => state.user);

  const columns: ColumnDef<IVoucherRedemptionGet>[] = [
    {
      accessorKey: 'voucher.name',
      id: 'voucher.name',
      header: 'Voucher',
      cell: ({ row }) => (
        <div className='flex items-center justify-between gap-2'>
          {row.original.voucher?.name}
          <Link
            className='text-blue-600'
            href={`/vouchers/${row.original.voucher.code}`}
          >
            <ExternalLink size={12} />
          </Link>
        </div>
      ),
    },
    {
      accessorKey: 'voucher.code',
      id: 'voucher.code',
      header: 'Code',
      cell: ({ row }) => (
        <div className='p-2 border-2 border-green-600 border-dashed  flex items-center gap-3 justify-between'>
          <Typography.H5 className='cursor-pointer text-green-600'>
            {row.original.voucher.code}
          </Typography.H5>
          <CopyButton
            content={row.original.voucher.code}
            className='bg-success hover:bg-success/70 no-row-click'
            size='sm'
          />
        </div>
      ),
    },
    {
      accessorKey: 'user_name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('user_name')}</div>,
    },
    {
      accessorKey: 'user_email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('user_email')}</div>,
    },
    {
      accessorKey: 'order_amount',
      header: 'Order Amount',
      cell: ({ row }) => (
        <Badge className='capitalize' variant={'outline'}>
          {discountSymbol[discountType[0] as DiscountType]({
            currency: user.organization.currency_symbol,
            amount: row.getValue('order_amount'),
          })}
        </Badge>
      ),
    },
    {
      accessorKey: 'discount_amount',
      header: 'Discount',
      cell: ({ row }) =>
        row.getValue('discount_amount') ? (
          <Badge className='bg-success text-white'>{`${discountSymbol[
            discountType[0] as DiscountType
          ]({
            currency: user.organization.currency_symbol,
            amount: row.getValue('discount_amount'),
          })}`}</Badge>
        ) : null,
    },
    {
      accessorKey: 'final_payable_amount',
      header: 'Final Payable Amount',
      cell: ({ row }) => (
        <Badge className='border-success text-success' variant={'outline'}>
          {discountSymbol[discountType[0] as DiscountType]({
            currency: user.organization.currency_symbol,
            amount: row.getValue('final_payable_amount'),
          })}
        </Badge>
      ),
    },
    {
      accessorKey: 'ip_address',
      enableSorting: false,
      header: 'IP-Address',
      cell: ({ row }) => <div>{row.getValue('ip_address')}</div>,
    },
    {
      accessorKey: 'user_agent',
      enableSorting: false,
      header: 'Platform',
      cell: ({ row }) => {
        const { browser, device } = getUserAgentDeviceInfo(
          row.getValue('user_agent')
        );
        return (
          <div>
            {device}, {browser}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      enableSorting: false,
      header: 'Status',
      cell: ({ row }) => {
        return (
          <Badge
            className={cn(
              voucherRedeemStatus.success === row.original.status
                ? 'bg-success'
                : 'bg-destructive'
            )}
          >
            {row.getValue('status')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Redeemed At',
      cell: ({ row }) => (
        <div> {moment(row.getValue('created_at')).format('lll')}</div>
      ),
    },
  ];
  return (
    <div className='space-y-6'>
      <PageHeader
        title={"Voucher's Redemptions"}
        description="Manage and Track your Voucher's or Coupon's Redemptions"
      />

      <CardComponent>
        <Suspense fallback={<TableSkeleton />}>
          <ListViewComponent
            showDownloadButton={false}
            url={`/voucher-redeem/organization/list`}
            filterComponent='voucher-redeemed'
            defaultOrderBy='DESC'
            columns={columns}
            emptyStateMsg={{
              createButtonLabel: 'Create Voucher',
              heading: 'No Redemptions found',
              desc: 'There are no redemptions available at the moment. Check back later or redeem a new voucher to get started.',
            }}
          />
        </Suspense>
      </CardComponent>
    </div>
  );
};

export default RedeemedVouchersList;
