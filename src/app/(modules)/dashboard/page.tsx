import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/global/components/page-header/page-header';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDashboardDataService } from './actions/services';
import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import { IDashboardGet } from './model-interfaces/interfaces';
import { JSX, Suspense } from 'react';
import CardSkeleton from './components/card-skeleton';
import { Ticket, Activity, Clock, Calendar, Gift } from 'lucide-react'; // 👈 icons added

export default async function Dashboard() {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) {
    redirect('/auth/login');
  }

  const res = await getDashboardDataService(jwt);

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
    nearingExpiry: {
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
        {Object.keys(res.data).map((key) => {
          const k = key as keyof IDashboardGet;

          return (
            <Suspense key={k} fallback={<CardSkeleton />}>
              <CardComponent
                title={cardMeta[k]?.title ?? ''}
                cardContentClass='space-y-2'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <Typography.H2>{res?.data[k] ?? 0}</Typography.H2>
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='border-b'>
                <th className='p-2'>Code</th>
                <th className='p-2'>Discount</th>
                <th className='p-2'>Status</th>
                <th className='p-2'>Expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b hover:bg-gray-50'>
                <td className='p-2 font-mono'>SAVE20</td>
                <td className='p-2'>20%</td>
                <td className='p-2 text-green-600'>Active</td>
                <td className='p-2'>2025-12-31</td>
              </tr>
              <tr className='border-b hover:bg-gray-50'>
                <td className='p-2 font-mono'>WELCOME50</td>
                <td className='p-2'>50%</td>
                <td className='p-2 text-red-600'>Expired</td>
                <td className='p-2'>2025-06-01</td>
              </tr>
              <tr className='hover:bg-gray-50'>
                <td className='p-2 font-mono'>NEW10</td>
                <td className='p-2'>10%</td>
                <td className='p-2 text-green-600'>Active</td>
                <td className='p-2'>2025-09-15</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
