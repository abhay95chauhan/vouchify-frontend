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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  type voucherRedeemedFilterForm,
  voucherRedeemedFilterSchema,
} from '../schema/schema';
import AsyncPaginateSelect from '@/global/components/select/select-async-paginate';
import { Input } from '@/components/ui/input';
import ReactSelectComponent from '@/global/components/select/react-select';
import moment from 'moment';
import { useAppSelector } from '@/redux/hook';
import { voucherRedeemStatus } from '../helpers/config';
import DateRangePicker from '@/global/components/date/date-range';
import { DateRange } from 'react-day-picker';

let persistedValues: voucherRedeemedFilterForm | null = null;
let persistedRange: DateRange | undefined;

type Props = {
  showModal: boolean;
  onCloseFilter: (isReset?: boolean) => void;
  applyFilter: (filter: Record<string, unknown>) => void;
};

export default function VoucherRedeemedFilter(props: Props) {
  const { user } = useAppSelector((state) => state.user);

  const [range, setRange] = useState<DateRange | undefined>(persistedRange);

  const form = useForm<voucherRedeemedFilterForm>({
    resolver: zodResolver(voucherRedeemedFilterSchema),
    defaultValues: {
      voucher_id: [],
      status: '',
      order_amount: { op: '', value: '' },
      discount_amount: { op: '', value: '' },
      final_payable_amount: { op: '', value: '' },
    },
  });

  const onSubmit = (values: voucherRedeemedFilterForm) => {
    const filters: Record<string, unknown> = {};

    if (values.voucher_id?.length)
      filters.voucher_id = {
        in: values.voucher_id.map((item) => item.value),
      };
    if (values.status) filters.status = values.status;

    ['order_amount', 'discount_amount', 'final_payable_amount'].forEach((f) => {
      const field = (values as any)[f] as {
        op?: string;
        value?: string | null;
      };
      if (field?.op) {
        if (
          field.value !== undefined &&
          field.value !== null &&
          field.value !== ''
        ) {
          filters[f] = { [field.op]: Number(field.value) };
        }
      }
    });

    if (range?.from && range?.to) {
      filters.created_at = {
        between: [
          moment(range.from).tz(user?.organization?.timezone).endOf('day'),
          moment(range.to).tz(user?.organization?.timezone).endOf('day'),
        ],
      };
    }

    props.applyFilter(filters);
    props.onCloseFilter(); // ✅ just close, don't reset
  };

  const onReset = () => {
    form.reset();
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
      persistedValues = value as voucherRedeemedFilterForm;
    });
    return () => subscription.unsubscribe?.();
  }, [form]);

  useEffect(() => {
    persistedRange = range;
  }, [range]);
  console.log(form.getValues());
  return (
    <CustomModal
      title='Filter'
      loading={false}
      showModal={props.showModal}
      size='xl'
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
          <div className='grid grid-cols-1 gap-4'>
            {/* Discount Type */}
            <FormField
              control={form.control}
              name='voucher_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voucher</FormLabel>
                  <FormControl>
                    <AsyncPaginateSelect
                      url='/voucher/list'
                      method='POST'
                      placeholder='e.g., VOUCHER-1'
                      value={
                        field.value as {
                          label: string;
                          value: string;
                        }[]
                      }
                      onChange={(data) => {
                        field.onChange(data);
                      }}
                      isMulti
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DateRangePicker
              value={range}
              placeholder={`e.g., ${moment()
                .tz(user?.organization?.timezone)
                .format('ll')} - ${moment()
                .tz(user?.organization?.timezone)
                .add(1, 'months')
                .format('ll')}`}
              tz={user?.organization?.timezone}
              onChange={setRange}
              weekStartsOn={1}
              label='Redeemed Between'
            />
          </div>

          {/* Text filters based on entity */}
          <div className='grid  gap-4'>
            {(
              [
                'order_amount',
                'discount_amount',
                'final_payable_amount',
              ] as const
            ).map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as any}
                render={({ field: f }) => {
                  const isUnlimited = f.value?.op === 'unlimited';
                  return (
                    <FormItem>
                      <FormLabel className='capitalize'>
                        {fieldName.replace(/_/g, ' ')}
                      </FormLabel>
                      <div className='flex items-center gap-2'>
                        <ReactSelectComponent
                          placeholder='Condition'
                          value={
                            f.value?.op
                              ? { label: f.value.op, value: f.value.op }
                              : null
                          }
                          onChange={(data) => {
                            const selected = Array.isArray(data)
                              ? data[0]
                              : data;

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
                          ]}
                        />
                        {!isUnlimited && (
                          <Input
                            disabled={!f.value?.op}
                            type='number'
                            value={(f.value?.value as string) || ''}
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
                  );
                }}
              />
            ))}

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <ReactSelectComponent
                      placeholder='e.g., Success'
                      value={
                        field.value
                          ? { label: field.value, value: field.value }
                          : null
                      }
                      onChange={(data) => {
                        const selected = Array.isArray(data) ? data[0] : data;
                        field.onChange(selected?.value ?? '');
                      }}
                      options={Object.values(voucherRedeemStatus).map(
                        (item) => ({ value: item, label: item })
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </CustomModal>
  );
}
