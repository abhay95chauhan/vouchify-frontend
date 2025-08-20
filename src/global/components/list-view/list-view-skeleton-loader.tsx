import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 8,
  columns = 1,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className='w-full'>
      <div className='rounded-md border'>
        {/* Table Header */}
        {showHeader && (
          <div className='border-b bg-muted/50'>
            <div className='flex'>
              {Array.from({ length: columns }).map((_, index) => (
                <div key={`header-${index}`} className='flex-1 p-4'>
                  <Skeleton className='h-4 w-3/4' />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Body */}
        <div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className='border-b last:border-b-0'>
              <div className='flex'>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className='flex-1 p-4'
                  >
                    <Skeleton className='h-4 w-full' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
