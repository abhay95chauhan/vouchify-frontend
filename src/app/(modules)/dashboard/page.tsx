'use client';
import { PageHeader } from '@/global/components/page-header/page-header';
import { redirect } from 'next/navigation';
import { getDashboardDataService } from './actions/services';
import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import { IDashboardGet } from './model-interfaces/interfaces';
import { JSX, Suspense, useEffect, useState } from 'react';
import CardSkeleton from './components/card-skeleton';
import { Ticket, Activity, Clock, Calendar, Gift } from 'lucide-react'; // 👈 icons added
import { TableSkeleton } from '@/global/components/list-view/list-view-skeleton-loader';
import ListViewComponent from '@/global/components/list-view/list-view';
import { ColumnDef } from '@tanstack/react-table';
import {
  DiscountType,
  IVoucherGet,
} from '../vouchers/interface-model/interfaces';
import VoucherCodeCopyComponent from '../vouchers/components/voucher-code-copy';
import { Badge } from '@/components/ui/badge';
import {
  checkVoucherStatus,
  discountSymbol,
  discountType,
} from '../vouchers/helpers/config';
import { useAppSelector } from '@/redux/hook';
import { Label } from '@/components/ui/label';
import moment from 'moment';

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.user);

  const [dashboardState, setDashboardState] = useState<IDashboardGet>();

  useEffect(() => {
    (async () => {
      const res = await getDashboardDataService();
      setDashboardState(res.data);
    })();
  }, []);

  // Card metadata with icons
  const cardMeta: Record<
    string,
    { title: string; subtitle: string; icon: JSX.Element }
  > = {
    total_vouchers: {
      title: 'Total Vouchers',
      subtitle: 'All issued vouchers',
      icon: <Ticket className='w-6 h-6 text-blue-500' />,
    },
    active_vouchers: {
      title: 'Active Vouchers',
      subtitle: 'Currently valid',
      icon: <Activity className='w-6 h-6 text-success' />,
    },
    upcoming_vouchers: {
      title: 'Upcoming Vouchers',
      subtitle: 'Vouchers to start soon',
      icon: <Calendar className='w-6 h-6 text-yellow-500' />,
    },
    total_redeemed_vouchers: {
      title: 'Redeemed',
      subtitle: 'Used vouchers',
      icon: <Gift className='w-6 h-6 text-primary' />,
    },
    nearing_expiry: {
      title: 'Expiring Soon',
      subtitle: 'Vouchers expiring within 7 days',
      icon: <Clock className='w-6 h-6 text-amber-500' />,
    },
    expired_vouchers: {
      title: 'Expired Vouchers',
      subtitle: 'Vouchers that expired',
      icon: <Clock className='w-6 h-6 text-destructive' />,
    },
  };

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
      cell: ({ row }) => <VoucherCodeCopyComponent code={row.original.code} />,
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
      cell: ({ row }) =>
        row.getValue('discount_value') ? (
          <Badge
            variant={'secondary'}
            className='capitalize'
          >{`${discountSymbol[row.original.discount_type]({
            currency: user.organization.currency_symbol,
            amount: row.getValue('discount_value'),
          })}`}</Badge>
        ) : null,
    },

    {
      accessorKey: 'min_order_amount',
      header: 'Minimum Order Amount',
      cell: ({ row }) => (
        <Badge
          className='capitalize'
          variant={
            row.getValue('min_order_amount') ? 'secondary' : 'destructive'
          }
        >
          {discountSymbol[discountType[0] as DiscountType]({
            currency: user.organization.currency_symbol,
            amount: row.getValue('min_order_amount'),
          })}
        </Badge>
      ),
    },
    {
      accessorKey: 'max_discount_amount',
      header: 'Maximum Discount',
      cell: ({ row }) =>
        row.getValue('max_discount_amount') ? (
          <Badge
            className='capitalize border-success text-success pt-0'
            variant={'outline'}
          >
            {discountSymbol[discountType[0] as DiscountType]({
              currency: user.organization.currency_symbol,
              amount: row.getValue('max_discount_amount'),
            })}
          </Badge>
        ) : (
          <Badge
            variant={'outline'}
            className='border-destructive text-destructive pt-0'
          >
            None
          </Badge>
        ),
    },
    {
      accessorKey: 'redemption_count',
      header: 'Redeemed',
      cell: ({ row }) => {
        return (
          <Badge variant={'outline'} className='border-success text-success'>
            {row.original.redemption_count ?? 0}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'redemption_left',
      enableSorting: false,
      header: 'Redemptions Left',
      cell: ({ row }) => {
        const { max_redemptions, redemption_count } = row.original;

        const redemptionsLeft =
          max_redemptions == null
            ? 'Unlimited'
            : Math.max(max_redemptions - redemption_count, 0); // never negative

        return (
          <Badge variant={'outline'} className='capitalize'>
            {redemptionsLeft}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'eligible_products',
      enableSorting: false,
      header: 'Linked Products',
      cell: ({ row }) => {
        return (
          <Badge variant={'outline'} className='capitalize'>
            {row.original.eligible_products?.length ?? 0}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'last_redeemed_at',
      enableSorting: false,
      header: 'Last Redeemed At',
      cell: ({ row }) => {
        return (
          <Label className='capitalize'>
            {row.original.last_redeemed_at
              ? moment(row.original.last_redeemed_at).format('lll')
              : 'No Redeem'}
          </Label>
        );
      },
    },
    {
      accessorKey: 'start_date',
      header: 'Valid From',
      cell: ({ row }) => (
        <div className='capitalize'>
          {moment(row.getValue('start_date')).format('ll')}
        </div>
      ),
    },
    {
      accessorKey: 'end_date',
      header: 'Valid Until',
      cell: ({ row }) => (
        <div className='capitalize'>
          {moment(row.getValue('end_date')).format('ll')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      enableSorting: false,
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
  ];

  return (
    <main className='space-y-6'>
      {/* Top bar */}
      <PageHeader
        backRedirectUrl={'/vouchers'}
        title={'Dashboard'}
        description='Manage and Monitor your Dashboard.'
      />

      {/* Stats */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
        {dashboardState &&
          Object.keys(dashboardState as IDashboardGet).map((key) => {
            const k = key as keyof IDashboardGet;

            return (
              <Suspense key={k} fallback={<CardSkeleton />}>
                <CardComponent
                  title={cardMeta[k]?.title ?? ''}
                  cardContentClass='space-y-2'
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <Typography.H2>{dashboardState?.[k] ?? 0}</Typography.H2>
                      <Typography.Muted>
                        {cardMeta[k]?.subtitle ?? ''}
                      </Typography.Muted>
                    </div>
                    <div className='p-3 bg-muted rounded-full shadow-sm'>
                      {cardMeta[k]?.icon ?? ''}
                    </div>
                  </div>
                </CardComponent>
              </Suspense>
            );
          })}
      </div>

      {/* Recent Vouchers */}
      <CardComponent>
        <Typography.H3>Top 5 Recent Vouchers</Typography.H3>
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
            url='/voucher/recent/list'
            defaultOrderBy='DESC'
            showFooter={false}
            showSearch={false}
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
    </main>
  );
}
