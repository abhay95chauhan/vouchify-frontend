import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CardSkeleton = () => (
  <Card className='animate-pulse'>
    <CardHeader>
      <CardTitle>
        <div className='h-4 w-24 bg-gray-300 rounded'></div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='h-8 w-12 bg-gray-300 rounded mb-1'></div>
      <div className='h-3 w-16 bg-gray-200 rounded'></div>
    </CardContent>
  </Card>
);

export default CardSkeleton;
