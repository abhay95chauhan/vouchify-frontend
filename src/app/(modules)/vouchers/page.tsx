'use client';
import { Button } from '@/components/ui/button';
import CardComponent from '@/global/components/card/card-component';
import ListViewComponent from '@/global/components/list-view/list-view';
import { Typography } from '@/global/components/typography/typography';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Search } from 'lucide-react';
import React, { Suspense } from 'react';
import { IVoucherGet } from './interface-model/interfaces';
import { TableSkeleton } from '@/global/components/list-view/list-view-skeleton-loader';

const VouchersList = () => {
  const columns: ColumnDef<IVoucherGet>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
      ),
    },
  ];

  return (
    <>
      <CardComponent
        title={
          <div className='flex justify-between items-center'>
            <Typography.H3>Vouchers</Typography.H3>
            <Button>
              <Plus /> Create Voucher
            </Button>
          </div>
        }
        desc='Create, Manage and Track your Discount Vouchers and Coupons'
      >
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
    </>
  );
};

export default VouchersList;
