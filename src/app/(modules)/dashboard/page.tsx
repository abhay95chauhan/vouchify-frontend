import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/global/components/page-header/page-header';

export default function Dashboard() {
  return (
    <main className='space-y-6'>
      {/* Top bar */}
      <PageHeader
        backRedirectUrl={'/vouchers'}
        title={'Dashboard'}
        description='Manage and Monitor your Dashboard.'
      />

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <Card>
          <CardHeader>
            <CardTitle>Total Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>1,245</p>
            <p className='text-sm text-gray-500'>All issued vouchers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>820</p>
            <p className='text-sm text-gray-500'>Currently valid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Redeemed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>425</p>
            <p className='text-sm text-gray-500'>Used vouchers</p>
          </CardContent>
        </Card>
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
