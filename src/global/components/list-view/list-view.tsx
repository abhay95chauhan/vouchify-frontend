'use client';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { vouchifyApi } from '@/global/utils/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { TableSkeleton } from './list-view-skeleton-loader';
import { Typography } from '../typography/typography';

interface VouchersTableProps<T> {
  url: string;
  columns: ColumnDef<T>[];
  emptyStateMsg: {
    heading: string;
    desc: string;
    createButtonLabel: string;
  };
}

interface ApiResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function VouchersTable<T>({
  url,
  columns,
  emptyStateMsg,
}: VouchersTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  const makeApiRequest = async <T,>(
    url: string,
    page = 1,
    limit = 10,
    search = ''
  ): Promise<ApiResponse<T>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const result = await vouchifyApi.request<T>(`${url}?${params}`, {
        method: 'GET',
      });

      console.log(result, 'result');
      return result as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await makeApiRequest<T>(
        url,
        currentPage,
        pageSize,
        debouncedSearch
      );
      setData(result.data);
      setTotalPages(result?.pagination?.totalPages);
      setTotalItems(result?.pagination?.total);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [url, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Disable client-side pagination
    pageCount: totalPages,
  });

  if (loading) {
    return <TableSkeleton />;
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === 'ellipsis' ? (
        <PaginationItem key={`ellipsis-${index}`}>
          <PaginationEllipsis />
        </PaginationItem>
      ) : (
        <PaginationItem key={page}>
          <PaginationLink
            href='#'
            isActive={page === currentPage}
            onClick={(e) => {
              e.preventDefault();
              goToPage(page as number);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      )
    );
  };

  const EmptyState = () => {
    return (
      <div className='flex flex-col items-center justify-center text-center space-y-4'>
        <div className='bg-muted/30 rounded-full p-6 mb-6'>
          <Search className='h-8 w-8 text-muted-foreground' />
        </div>
        <Typography.H3>{emptyStateMsg.heading}</Typography.H3>
        <Typography.Muted>{emptyStateMsg.desc}</Typography.Muted>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='gap-2 bg-transparent'
            onClick={() => window.location.reload()}
          >
            <Search className='h-4 w-4' />
            Refresh
          </Button>
          <Button className='gap-2'>
            <Plus className='h-4 w-4' />
            {emptyStateMsg.createButtonLabel}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className='w-full'>
      <div className='flex items-center pb-4'>
        <div className='relative w-sm'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          {searchQuery && (
            <Plus
              onClick={() => setSearchQuery('')}
              className='cursor-pointer absolute rotate-45 right-4 top-2.5 h-4 w-4 text-muted-foreground'
            />
          )}
          <Input
            placeholder='Search...'
            value={searchQuery}
            // type='search'
            autoFocus
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      <div className='w-full border'>
        <Table className='w-full table-fixed bg-primary/10'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='w-full'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='text-left px-4 border-b'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
        <ScrollArea className='h-80 w-full'>
          <Table className='w-full table-fixed'>
            <TableBody>
              {data?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='px-4'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className='w-full hover:bg-red'>
                  <TableCell colSpan={columns.length} className=' text-center'>
                    {EmptyState()}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {data.length ? (
        <div className='flex flex-col lg:flex-row items-center justify-between space-x-2 gap-2 py-4'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Rows per page</p>
            <Select
              onValueChange={(e) => {
                setPageSize(Number(e));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
              defaultValue={String(pageSize)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Page' />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem value={String(size)}> {size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Typography.Muted>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{' '}
              results
            </Typography.Muted>
          </div>

          <div>
            <Pagination>
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                {renderPageNumbers()}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      ) : null}
    </div>
  );
}
