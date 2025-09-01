'use client';
import { Button } from '@/components/ui/button';
import CardComponent from '@/global/components/card/card-component';
import ListViewComponent from '@/global/components/list-view/list-view';
import { Typography } from '@/global/components/typography/typography';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import React, { Suspense, useState } from 'react';
import { DiscountType, IVoucherGet } from '../interface-model/interfaces';
import { TableSkeleton } from '@/global/components/list-view/list-view-skeleton-loader';
import {
  checkVoucherStatus,
  discountSymbol,
  discountType,
} from '../helpers/config';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CustomDropdown from '@/global/components/drop-down/custom-dropdown';
import AlertModal from '@/global/components/modal/alert-modal';
import { errorMessages } from '@/global/utils/error-message';
import { deleteVoucherByCodeService } from '../actions/services';
import { toast } from 'sonner';
import { setHardRefresh } from '@/redux/common-reducers';
import { PageHeader } from '@/global/components/page-header/page-header';

const VouchersList = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);
  const { hardRefresh } = useAppSelector((state) => state.common);

  const [state, setState] = useState({
    showVoucherDeleteModal: false,
    voucherCode: '',
  });

  const threeDotMenu = [
    {
      label: 'Delete',
      fn: async (row: IVoucherGet) => {
        setState((prev) => ({
          ...prev,
          showVoucherDeleteModal: true,
          voucherCode: row.code,
        }));
      },
      labelClass: 'text-destructive font-medium',
    },
  ];

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
            className='bg-success hover:bg-success/70 no-row-click'
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
        ]({
          currency: user.organization.currency_symbol,
          amount: row.getValue('discount_value'),
        })}`}</div>
      ),
    },

    {
      accessorKey: 'min_order_amount',
      header: 'Minimum Order Amount',
      cell: ({ row }) => (
        <div className='capitalize'>
          {discountSymbol[discountType[0] as DiscountType]({
            currency: user.organization.currency_symbol,
            amount: row.getValue('min_order_amount'),
          })}
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
              variant={status?.status ? 'default' : 'destructive'}
              className='text-sm'
            >{`${status?.isActive}`}</Badge>
          </div>
        );
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <CustomDropdown
            data={row.original}
            menu={threeDotMenu}
            label='Actions'
          >
            <div className=' no-row-click'>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>
          </CustomDropdown>
        );
      },
    },
  ];

  const deleteVoucherHandler = async () => {
    const res = await deleteVoucherByCodeService(state.voucherCode);
    if (res?.error) {
      toast.error(res?.error.message);
    } else {
      toast.success(res?.message);
    }
    await dispatch(setHardRefresh(!hardRefresh));
    onCloseModal();
  };

  const onCloseModal = () => {
    setState((prev) => ({
      ...prev,
      showVoucherDeleteModal: false,
      voucherCode: '',
    }));
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <PageHeader
          title={'Vouchers'}
          description='Create, Manage and Track your Discount Vouchers and Coupons'
        />

        <Button asChild>
          <Link href={'/vouchers/create'}>
            <Plus /> Create Voucher
          </Link>
        </Button>
      </div>
      <CardComponent>
        <Suspense fallback={<TableSkeleton />}>
          <ListViewComponent
            onRowClick={(row, event) => {
              const targetElement = event.target as HTMLElement;
              if (
                targetElement.closest('.no-row-click') ||
                targetElement.role === 'checkbox' ||
                targetElement.role === 'menuitem'
              ) {
                return;
              }
              redirect(`/vouchers/${row.original.code}`);
            }}
            url='/voucher/list'
            columns={columns}
            emptyStateMsg={{
              createButtonLabel: 'Create Voucher',
              heading: 'No vouchers found',
              desc: 'There are no vouchers available at the moment. Check back later or create a new voucher to get started.',
              createButtonFn: () => {
                redirect(`/vouchers/create`);
              },
            }}
          />
        </Suspense>
      </CardComponent>

      {/* Delete Voucher */}
      <AlertModal
        deleteFn={deleteVoucherHandler}
        showModal={state.showVoucherDeleteModal}
        onClose={onCloseModal}
        btnTitle='Delete'
        subTitle={errorMessages.voucher.delete}
      />
    </div>
  );
};

export default VouchersList;
