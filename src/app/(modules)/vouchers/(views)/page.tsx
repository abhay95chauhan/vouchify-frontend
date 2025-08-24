'use client';
import { Button } from '@/components/ui/button';
import CardComponent from '@/global/components/card/card-component';
import ListViewComponent from '@/global/components/list-view/list-view';
import { Typography } from '@/global/components/typography/typography';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import React, { Suspense } from 'react';
import { IVoucherGet } from '../interface-model/interfaces';
import { TableSkeleton } from '@/global/components/list-view/list-view-skeleton-loader';
import { checkVoucherStatus, discountSymbol } from '../helpers/config';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { useAppSelector } from '@/redux/hook';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import Link from 'next/link';

const VouchersList = () => {
  const { user } = useAppSelector((state) => state.user);

  const columns: ColumnDef<IVoucherGet>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <div className='p-2 border-2 border-green-600 border-dashed  flex items-center gap-3 justify-between'>
          <Typography.H5 className='cursor-pointer text-green-600'>
            {row.getValue('code')}
          </Typography.H5>
          <CopyButton
            content={row.getValue('code')}
            className='bg-success hover:bg-green-500 '
            // variant='outline'
            size='sm'
          />
        </div>
      ),
    },
    {
      accessorKey: 'discount_type',
      header: 'Discount Type',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('discount_type')}</div>
      ),
    },
    {
      accessorKey: 'discount_value',
      header: 'Discount Value',
      cell: ({ row }) => (
        <div className='capitalize'>{`${discountSymbol[
          row.original.discount_type
        ](user.organization.currency_symbol)} ${row.getValue(
          'discount_value'
        )}`}</div>
      ),
    },

    {
      accessorKey: 'min_order_amount',
      header: 'Minimum Amount',
      cell: ({ row }) => (
        <div className='capitalize'>
          {discountSymbol[row.original.discount_type](
            user.organization.currency_symbol
          )}
          &nbsp; {row.getValue('min_order_amount')}
        </div>
      ),
    },
    {
      accessorKey: 'start_date',
      header: 'Start Date',
      cell: ({ row }) => (
        <div className='capitalize'>
          {moment(row.getValue('start_date')).format('ll')}
        </div>
      ),
    },
    {
      accessorKey: 'end_date',
      header: 'End Date',
      cell: ({ row }) => (
        <div className='capitalize'>
          {moment(row.getValue('end_date')).format('ll')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = checkVoucherStatus(
          row.original.start_date,
          row.original.end_date,
          user.organization.timezone
        );
        return (
          <div className='capitalize'>
            <Badge
              variant={status.status ? 'default' : 'destructive'}
              className='text-sm'
            >{`${status.isActive}`}</Badge>
          </div>
        );
      },
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div className='space-y-4'>
          <Typography.H2>Vouchers</Typography.H2>
          <Typography.Muted>
            Create, Manage and Track your Discount Vouchers and Coupons
          </Typography.Muted>
        </div>
        <Button asChild>
          <Link href={'/vouchers/create'}>
            <Plus /> Create Voucher
          </Link>
        </Button>
      </div>
      <CardComponent>
        <Suspense fallback={<TableSkeleton />}>
          <ListViewComponent
            url='/voucher/list'
            columns={columns}
            emptyStateMsg={{
              createButtonLabel: 'Create Voucher',
              heading: 'No vouchers found',
              desc: 'There are no vouchers available at the moment. Check back later or create a new voucher to get started.',
            }}
          />
        </Suspense>
      </CardComponent>
    </div>
  );
};

export default VouchersList;
