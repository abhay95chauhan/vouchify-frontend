'use client';

import { CustomModal } from '@/global/components/modal/custom-modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ReactSelectComponent, {
  type OptionType,
} from '@/global/components/select/react-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import moment from 'moment';
import { X } from 'lucide-react';
import { discountType, redeemPerUser } from '../helpers/config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import {
  type VouchersFilterForm,
  vouchersFilterSchema,
} from '../schema/schema';

let persistedValues: VouchersFilterForm | null = null;
let persistedRange: DateRange | undefined;

type Props = {
  showModal: boolean;
  onCloseFilter: (isReset?: boolean) => void;
  applyFilter: (filter: Record<string, unknown>) => void;
};

export default function VouchersFilter(props: Props) {
  const discountOptions: OptionType[] = useMemo(
    () => discountType.map((d) => ({ label: d, value: d })),
    []
  );
  const redeemOptions: OptionType[] = useMemo(
    () => redeemPerUser.map((d) => ({ label: d, value: d })),
    []
  );

  const [range, setRange] = useState<DateRange | undefined>(persistedRange);

  const form = useForm<VouchersFilterForm>({
    resolver: zodResolver(vouchersFilterSchema),
    defaultValues: {
      discount_type: '',
      redeem_limit_per_user: '',
      min_order_amount: { op: '', value: '' },
      max_discount_amount: { op: '', value: '' },
      discount_value: { op: '', value: '' },
      redemption_count: { op: '', value: '' },
      max_redemptions: { op: '', value: '' },
      date_range: { from: undefined, to: undefined },
    },
  });

  const onSubmit = (values: VouchersFilterForm) => {
    const filters: Record<string, unknown> = {};

    if (values.discount_type) filters.discount_type = values.discount_type;
    if (values.redeem_limit_per_user)
      filters.redeem_limit_per_user = values.redeem_limit_per_user;
    [
      'min_order_amount',
      'max_discount_amount',
      'discount_value',
      'redemption_count',
      'max_redemptions',
    ].forEach((f) => {
      const field = values[f as keyof VouchersFilterForm] as {
        op?: string;
        value?: string;
      };
      if (field?.op && field?.value) {
        filters[f] = { [field.op]: Number(field.value) };
      }
    });

    if (range?.from) filters.start_date = { gte: range.from };
    if (range?.to) filters.end_date = { lte: range.to };

    if (values.max_redemptions?.op === 'unlimited') {
      filters.max_redemptions = {
        eq: null,
      }; // backend can treat null as unlimited
    } else if (values.max_redemptions?.op && values.max_redemptions?.value) {
      filters.max_redemptions = {
        [values.max_redemptions.op]: Number(values.max_redemptions.value),
      };
    }

    props.applyFilter(filters);
    props.onCloseFilter(); // ✅ just close, don't reset
  };

  console.log('mount');
  useEffect(() => {
    console.log('form', form.getValues());
  }, []);

  const onReset = () => {
    form.reset();
    setRange(undefined);
    persistedValues = null;
    persistedRange = undefined;
    props.onCloseFilter(true);
  };

  useEffect(() => {
    if (persistedValues) {
      form.reset(persistedValues);
    }
    if (persistedRange) {
      setRange(persistedRange);
    }
    const subscription = form.watch((value) => {
      persistedValues = value as VouchersFilterForm;
    });
    return () => subscription.unsubscribe?.();
  }, [form]);

  useEffect(() => {
    persistedRange = range;
  }, [range]);

  return (
    <CustomModal
      title='Filter'
      loading={false}
      showModal={props.showModal}
      size='4xl'
      buttonLabel='Apply'
      clearButtonLabel='Reset'
      crossClose={props.onCloseFilter}
      close={onReset}
      save={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <form
          className='space-y-6 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='grid grid-cols-2 gap-4'>
            {/* Discount Type */}
            <FormField
              control={form.control}
              name='discount_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <FormControl>
                    <ReactSelectComponent
                      placeholder='e.g., Percentage'
                      value={
                        field.value
                          ? { label: field.value, value: field.value }
                          : null
                      }
                      onChange={(data) => {
                        const selected = Array.isArray(data) ? data[0] : data;
                        field.onChange(selected?.value ?? '');
                      }}
                      options={discountOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Redeem per user */}
            <FormField
              control={form.control}
              name='redeem_limit_per_user'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit Per User</FormLabel>
                  <FormControl>
                    <ReactSelectComponent
                      placeholder='e.g., Once'
                      value={
                        field.value
                          ? { label: field.value, value: field.value }
                          : null
                      }
                      onChange={(data) => {
                        const selected = Array.isArray(data) ? data[0] : data;
                        field.onChange(selected?.value ?? '');
                      }}
                      options={redeemOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Numeric filters */}
          <div className='grid grid-cols-2 gap-4'>
            {(
              [
                'min_order_amount',
                'max_discount_amount',
                'discount_value',
                'redemption_count',
                'max_redemptions',
              ] as const
            ).map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className='capitalize'>
                      {field.replace(/_/g, ' ')}
                    </FormLabel>
                    <div className='flex gap-2'>
                      <ReactSelectComponent
                        placeholder='Condition'
                        value={
                          f.value?.op
                            ? { label: f.value.op, value: f.value.op }
                            : null
                        }
                        onChange={(data) => {
                          const selected = Array.isArray(data) ? data[0] : data;

                          if (!selected) {
                            // ✅ reset to empty operator/value object instead of undefined
                            f.onChange({ op: '', value: '' });
                            return;
                          }

                          if (selected.value === 'unlimited') {
                            f.onChange({ op: 'unlimited', value: null });
                          } else {
                            f.onChange({ ...f.value, op: selected.value });
                          }
                        }}
                        options={[
                          { label: '=', value: 'eq' },
                          { label: '!=', value: 'neq' },
                          { label: '>', value: 'gt' },
                          { label: '>=', value: 'gte' },
                          { label: '<', value: 'lt' },
                          { label: '<=', value: 'lte' },
                          ...(field === 'max_redemptions'
                            ? [{ label: 'Unlimited', value: 'unlimited' }]
                            : []),
                        ]}
                      />

                      {/* hide input if "unlimited" */}
                      {f.value?.op !== 'unlimited' && (
                        <Input
                          disabled={!f.value?.op}
                          type='number'
                          value={f.value?.value || ''}
                          placeholder='Value'
                          className='flex-1'
                          onChange={(e) =>
                            f.onChange({ ...f.value, value: e.target.value })
                          }
                        />
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Date Range */}
          <div className='space-y-2'>
            <Label>Validity Period</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  id='dates'
                  className={cn(
                    range?.from && range?.to
                      ? 'text-black'
                      : 'text-muted-foreground',
                    'w-full justify-between font-normal'
                  )}
                >
                  {range?.from && range?.to
                    ? `${moment(range.from).format('ll')} - ${moment(
                        range.to
                      ).format('ll')}`
                    : `e.g., ${moment().format('ll')} - ${moment()
                        .add(1, 'months')
                        .format('ll')}`}
                  {range?.from && range?.to && <X />}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
              >
                <Calendar mode='range' selected={range} onSelect={setRange} />
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </Form>
    </CustomModal>
  );
}
