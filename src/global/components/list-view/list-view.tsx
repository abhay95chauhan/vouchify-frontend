'use client';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
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
import { useState, useEffect, useCallback, MouseEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDownIcon,
  Loader2,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
} from 'lucide-react';
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
import { useAppSelector } from '@/redux/hook';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ListFilter from './list-filter';
import { Badge } from '@/components/ui/badge';
import { CustomModal } from '../modal/custom-modal';
import { FileUploader } from '../file-upload/file-upload';

interface TableProps<T> {
  onRowClick?: (row: Row<T>, e: MouseEvent<HTMLTableRowElement>) => void;
  url: string;
  showFooter?: boolean;
  showSearch?: boolean;
  showDownloadButton?: boolean;
  filterComponent?: string;
  importComponent?: boolean;
  defaultOrderBy?: 'ASC' | 'DESC';
  columns: ColumnDef<T>[];
  emptyStateMsg: {
    heading: string;
    desc: string;
    createButtonLabel: string;
    createButtonFn?: () => void;
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

export default function ListViewTable<T>({
  url,
  columns,
  emptyStateMsg,
  onRowClick,
  showDownloadButton,
  filterComponent,
  importComponent,
  defaultOrderBy,
  showFooter,
  showSearch,
}: TableProps<T>) {
  const { hardRefresh } = useAppSelector((state) => state.common);

  const [state, setState] = useState({
    downloadLoader: false,
    showFilterModal: false,
    showImportModal: false,
    importLoading: false,
    csvFile: null as File | null,
  });

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderByField, setOrderByField] = useState('');
  const [orderBy, setOrderBy] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});

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
        orderByField: orderByField.toString(),
        orderBy:
          (!orderByField ? defaultOrderBy : !orderBy ? 'ASC' : 'DESC') || 'ASC',
        ...(search && { search }),
      });

      const result = await vouchifyApi.request<T>(`${url}?${params}`, {
        method: 'POST',
        data: {
          filters,
        } as T,
      });

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
      setData([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    url,
    currentPage,
    pageSize,
    debouncedSearch,
    orderBy,
    defaultOrderBy,
    orderByField,
    filters,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData, hardRefresh]);

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
      <div className='flex flex-col items-center justify-center text-center space-y-4 mb-4 mt-2'>
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
          {emptyStateMsg.createButtonFn && (
            <Button className='gap-2' onClick={emptyStateMsg.createButtonFn}>
              <Plus className='h-4 w-4' />
              {emptyStateMsg.createButtonLabel}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const downloadTable = async () => {
    try {
      const res = await vouchifyApi.request(`${url}/export`, {
        method: 'POST',
        responseType: 'blob', // ⬅️ IMPORTANT: tells axios to return file data
      });

      // Create a blob URL for the CSV file
      const blob = new Blob([res], { type: 'text/csv' });
      const urlObject = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = urlObject;
      link.download = 'export.csv'; // change as needed
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(urlObject);

      toast.success('List exported successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to download');
    }
  };

  const handleCloseFilter = (isReset?: boolean) => {
    if (isReset) {
      setFilters({});
    }
    setState((prev) => ({ ...prev, showFilterModal: false }));
  };

  const handleApplyFilter = (filterData: Record<string, unknown>) => {
    setFilters(filterData);
    handleCloseFilter();
  };

  const howManyFilterAreApplied = Object.keys(filters).map((item) => item);

  const handleImportVouchers = async () => {
    if (!state.csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      setState((prev) => ({ ...prev, importLoading: true }));

      const formData = new FormData();
      formData.append('file', state.csvFile);

      // Use fetch directly for FormData (vouchifyApi stringifies data as JSON which breaks FormData)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}/import`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include', // Important for cookies
          // Don't set Content-Type header - browser will set it with boundary for FormData
        }
      );

      const result = await response.json();

      if (response.ok && result && !result.error) {
        toast.success(result.message || 'Vouchers imported successfully');
        setState((prev) => ({
          ...prev,
          showImportModal: false,
          csvFile: null,
          importLoading: false,
        }));
        fetchData();
      } else {
        toast.error(result?.message || 'Failed to import vouchers');
        setState((prev) => ({ ...prev, importLoading: false }));
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import vouchers');
      setState((prev) => ({ ...prev, importLoading: false }));
    }
  };

  return (
    <>
      <div className='w-full'>
        <div className='flex items-center justify-between pb-4 gap-2'>
          {showSearch !== false ? (
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
          ) : null}
          <div className='flex items-center gap-2'>
            {filterComponent ? (
              <div className='relative'>
                <Button
                  variant={'outline'}
                  onClick={() =>
                    setState((prev) => ({ ...prev, showFilterModal: true }))
                  }
                >
                  <SlidersHorizontal /> Filter
                </Button>
                {howManyFilterAreApplied?.length ? (
                  <Badge className='absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]'>
                    {howManyFilterAreApplied?.length}
                  </Badge>
                ) : null}
              </div>
            ) : null}
            {importComponent ? (
              <Button
                variant={'secondary'}
                onClick={() =>
                  setState((prev) => ({ ...prev, showImportModal: true }))
                }
              >
                <Upload /> Import
              </Button>
            ) : null}
          </div>
        </div>

        <div className='border'>
          <ScrollArea>
            <Table>
              <TableHeader className='bg-primary/10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        onClick={() => {
                          if (header.column.columnDef.enableSorting !== false) {
                            setOrderByField(header.column.id);
                            setOrderBy((prev) => !prev);
                          }
                        }}
                        key={header.id}
                        className='text-left cursor-pointer space-x-2'
                      >
                        <div className='flex items-center gap-1'>
                          <Label>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </Label>
                          {orderByField === header.column.id ? (
                            orderBy ? (
                              <ArrowDown className='w-4 h-4 inline-block' />
                            ) : (
                              <ArrowUp className='w-4 h-4 inline-block' />
                            )
                          ) : (
                            header.column.columnDef.enableSorting !== false && (
                              <ArrowUpDown className='w-3 h-3 text-muted-foreground inline-block' />
                            )
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {data?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      onClick={(e) => onRowClick && onRowClick(row, e)}
                      key={row.id}
                      className='cursor-pointer'
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                    <TableCell colSpan={columns.length} className='text-center'>
                      {EmptyState()}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>

        {showFooter !== false && data?.length ? (
          <div className='flex flex-col lg:flex-row items-center justify-between space-x-2 gap-2 py-4'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>Rows</p>
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
                  {[10, 20, 30, 40, 50].map((size, index) => (
                    <SelectItem key={index} value={String(size)}>
                      {' '}
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Typography.Muted>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{' '}
                results
              </Typography.Muted>
              {showDownloadButton !== false && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'link'}>
                      Export As
                      {state.downloadLoader ? (
                        <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                      ) : (
                        <ChevronDownIcon className='ml-2 h-4 w-4' />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => downloadTable()}>
                      CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
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

      {/* Filter */}

      <ListFilter
        compName={filterComponent as string}
        showModal={state.showFilterModal}
        onCloseFilter={(isReset) => handleCloseFilter(isReset)}
        onApplyFilter={(filterData) => handleApplyFilter(filterData)}
      />

      <CustomModal
        title='Import Vouchers'
        loading={state.importLoading}
        showModal={state.showImportModal}
        size='4xl'
        buttonLabel='Import'
        clearButtonLabel='Cancel'
        crossClose={() =>
          setState((prev) => ({
            ...prev,
            showImportModal: false,
            csvFile: null,
          }))
        }
        close={() =>
          setState((prev) => ({
            ...prev,
            showImportModal: false,
            csvFile: null,
          }))
        }
        save={handleImportVouchers}
        disableBtn={!state.csvFile}
      >
        <div className='space-y-4'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <Typography.Muted className='text-sm'>
              <strong>Note:</strong> Only a maximum of 1000 vouchers can be
              imported at once. Please ensure your CSV file contains 1000 or
              fewer vouchers.
            </Typography.Muted>
          </div>
          <FileUploader
            // initialFileUrl={[state.csvFile ]?? undefined}
            fileChange={(file: File | File[] | null) => {
              const fileValue = Array.isArray(file) ? file[0] : file;
              console.log(fileValue, 'fileValue');
              setState((prev) => ({ ...prev, csvFile: fileValue }));
            }}
            multiple={false}
            accept='.csv,text/csv,application/vnd.ms-excel'
            maxSize={10 * 1024 * 1024} // 10MB
            description='Upload CSV file containing vouchers. CSV files up to 10MB'
          />
        </div>
      </CustomModal>
    </>
  );
}
