import { CustomModal } from '@/global/components/modal/custom-modal';
import React, { Suspense } from 'react';
import { IVoucherRedemptionGet } from '../model-interfaces/interfaces';
import { ColumnDef } from '@tanstack/react-table';
import ListViewComponent from '@/global/components/list-view/list-view';
import moment from 'moment';
import { getUserAgentDeviceInfo } from '../../account/helpers/config';
import { Badge } from '@/components/ui/badge';
import { discountSymbol, discountType } from '../../vouchers/helpers/config';
import {
  DiscountType,
  IVoucherGet,
} from '../../vouchers/interface-model/interfaces';
import { useAppSelector } from '@/redux/hook';
import { TableSkeleton } from '@/global/components/list-view/list-view-skeleton-loader';

interface IProps {
  voucher: IVoucherGet;
  showModal: boolean;
  closeModal: () => void;
}

const RedeemedVoucherModal = (props: IProps) => {
  const { user } = useAppSelector((state) => state.user);

  const onClose = () => {
    props.closeModal();
  };

  const columns: ColumnDef<IVoucherRedemptionGet>[] = [
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
      accessorKey: 'created_at',
      header: 'Redeemed At',
      cell: ({ row }) => (
        <div> {moment(row.getValue('created_at')).format('lll')}</div>
      ),
    },
  ];
  return (
    <>
      <CustomModal
        title={`${props.voucher.name} Redeemed Voucher`}
        loading={false}
        showModal={props.showModal}
        size='full'
        showCloseBtn={false}
        showSaveBtn={false}
        childrenClass='overflow-auto'
        close={onClose}
        save={onClose}
      >
        <Suspense fallback={<TableSkeleton />}>
          <ListViewComponent
            url={`/voucher-redeem/${props.voucher.id}`}
            columns={columns}
            emptyStateMsg={{
              createButtonLabel: 'Create Voucher',
              heading: 'No Redeemed Voucher found',
              desc: 'There are no Redeemed vouchers available at the moment. Check back later.',
            }}
          />
        </Suspense>
      </CustomModal>
    </>
  );
};

export default RedeemedVoucherModal;
