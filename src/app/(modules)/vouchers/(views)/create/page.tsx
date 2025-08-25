'use client';
import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import React, { useEffect, useState } from 'react';
import { VoucherPostSchema } from '../../schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, Infinity, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  buildVoucherCode,
  checkVoucherStatus,
  discountSymbol,
  discountType,
  generateVoucher,
  redeemPerUser,
} from '../../helpers/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/redux/hook';
import { DiscountType, IVoucherPost } from '../../interface-model/interfaces';
import { VoucherModelPost } from '../../interface-model/model';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/global/components/page-header/page-header';
import { DateSelector } from '@/global/components/date-selector/date-selector';
import moment from 'moment';
import { fieldValidation } from '@/global/utils/validation';
import { createVoucherService } from '../../actions/services';
import { toast } from 'sonner';
import { errorMessages } from '@/global/utils/error-messages';
import { redirect } from 'next/navigation';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const VoucherCreate = ({ voucherData }: { voucherData: IVoucherPost }) => {
  const { user } = useAppSelector((state) => state.user);
  const timezone = user.organization.timezone;

  const [state, setState] = useState({
    codeLength: 4,
    isLoading: false,
    isAutoGenerate: false,
    isVoucherActive: true,
    voucherStatus: '',
  });

  const form = useForm<z.input<typeof VoucherPostSchema>>({
    resolver: zodResolver(VoucherPostSchema),
    mode: 'all',
    defaultValues: {
      discount_type: voucherData?.discount_type ?? discountType[1],
      min_order_amount: 0,
      redeem_limit_per_user:
        voucherData?.redeem_limit_per_user ?? redeemPerUser[0],
      start_date: moment().tz(timezone)?.format('YYYY-MM-DD'),
      end_date: moment().tz(timezone)?.add(1, 'years')?.format('YYYY-MM-DD'),
    },
  });

  useEffect(() => {
    if (voucherData?.code) {
      form.reset({
        ...voucherData,
        code: voucherData.code.includes('-')
          ? voucherData.code.split('-')[1]
          : voucherData.code,
        max_redemptions: Number(voucherData?.max_redemptions) ?? null,
      });
      const status = checkVoucherStatus(
        voucherData.start_date,
        voucherData.end_date,
        user.organization.timezone
      );
      setState((prev) => ({
        ...prev,
        isVoucherActive: status?.status || false,
        voucherStatus: status?.isActive ?? '',
      }));
    } else {
      form.reset({
        ...form.getValues(),
        code: state.isAutoGenerate ? generateVoucher(state.codeLength) : '',
        prefix: state.isAutoGenerate ? generateVoucher(4) : '',
        postfix: state.isAutoGenerate ? generateVoucher(4) : '',
        discount_type: discountType[1],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, state.isAutoGenerate, state.codeLength, voucherData?.code]);

  async function onSubmit(values: z.infer<typeof VoucherPostSchema>) {
    setState((prev) => ({ ...prev, isLoading: true }));
    const vData = new VoucherModelPost(values as IVoucherPost);
    const res = await createVoucherService({
      ...vData,
      code: buildVoucherCode(values.prefix, values.code, values.postfix),
      organization_id: user.organization_id,
    });

    if (res) {
      if (res?.error) {
        toast.error(res.error.message);
      } else {
        toast.success(errorMessages.voucher.success.create);
        redirect('/vouchers');
      }
    }

    setState((prev) => ({ ...prev, isLoading: false }));
    console.log(res, 'res');
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  const voucherCode = buildVoucherCode(
    form?.watch('prefix'),
    form?.watch('code'),
    form?.watch('postfix')
  );
  return (
    <div className='space-y-6'>
      <PageHeader
        showBackButton
        onBack={() => redirect('/vouchers')}
        title={voucherData?.code ? 'Update Voucher' : 'Create New Voucher'}
        description='Design and configure your new promotional voucher.'
      />
      {voucherData?.code && !state.isVoucherActive ? (
        <Alert variant='destructive'>
          <AlertCircleIcon className='h-4 w-4' />
          <AlertTitle>Voucher Inactive</AlertTitle>
          <AlertDescription className='flex'>
            This voucher has <strong>{state.voucherStatus}</strong>. You can
            update its end date to make it active again, or you can delete it
          </AlertDescription>
        </Alert>
      ) : null}
      <div className='grid grid-cols-12 gap-4'>
        <div className='lg:col-span-8 col-span-12'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                onSubmit(values as z.infer<typeof VoucherPostSchema>)
              )}
              onReset={onReset}
              className='space-y-6 w-full'
            >
              <CardComponent
                title={
                  <>
                    <div className='flex sm:flex-row flex-col gap-4 items-start justify-between'>
                      <div className='space-y-2'>
                        <Typography.H4>Voucher Details</Typography.H4>
                        <Typography.Muted className='font-normal'>
                          Basic information about your voucher.
                        </Typography.Muted>
                      </div>
                      {!voucherData?.code ? (
                        <div className='flex gap-2 items-center'>
                          <Label>Auto Generate</Label>
                          <Switch
                            onCheckedChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                isAutoGenerate: e,
                              }))
                            }
                          />
                          <Select
                            disabled={!state.isAutoGenerate}
                            onValueChange={(e) => {
                              setState((prev) => ({
                                ...prev,
                                codeLength: parseInt(e),
                              }));
                            }}
                            defaultValue={state.codeLength?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Page' />
                            </SelectTrigger>
                            <SelectContent>
                              {[4, 8, 12].map((size, index) => (
                                <SelectItem key={index} value={String(size)}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : null}
                    </div>
                  </>
                }
                cardContentClass='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                      <FormLabel className='flex shrink-0'>
                        Voucher Name <span className='text-destructive'>*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder='e.g., Summer Sale Discount'
                          type='text'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-12 items-start gap-4'>
                  <FormField
                    control={form.control}
                    name='prefix'
                    render={({ field }) => (
                      <FormItem className='col-span-4'>
                        <FormLabel>Prefix</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., SUMMER'
                            type='text'
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem className='col-span-4'>
                        <FormLabel>
                          Code <span className='text-destructive'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., SUMMER20, FREESHIP'
                            disabled={state.isAutoGenerate}
                            type='text'
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='postfix'
                    render={({ field }) => (
                      <FormItem className='col-span-4'>
                        <FormLabel>Postfix</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g., USER20'
                            type='text'
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-4'>
                    <FormField
                      control={form.control}
                      name='discount_type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Discount Type
                            <span className='text-destructive'> *</span>
                          </FormLabel>
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='e.g., Percentage' />
                              </SelectTrigger>
                              <SelectContent>
                                {discountType?.map((item) => (
                                  <SelectItem key={item} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-4'>
                    <FormField
                      control={form.control}
                      name='discount_value'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch('discount_type')} (
                            {form.watch('discount_type')
                              ? discountSymbol[
                                  form.watch('discount_type') as DiscountType
                                ](user.organization.currency_symbol)
                              : null}
                            )<span className='text-destructive'> *</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='e.g., 20'
                              type='text'
                              onChange={(e) => {
                                const raw = e.target.value.replace(
                                  /[^\d.]/g,
                                  ''
                                );
                                let num = parseFloat(raw);
                                // if percentage → clamp 1-100
                                if (
                                  form.watch('discount_type') ===
                                  discountType[1]
                                ) {
                                  if (num > 100) num = 100;
                                  if (num < 1) num = 1;
                                }
                                field.onChange(
                                  raw === '' || isNaN(num) ? 0 : num
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-4'>
                    <FormField
                      control={form.control}
                      name='min_order_amount'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Minimum Order Amount (
                            {user.organization?.currency_symbol})
                            <span className='text-destructive'> *</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='e.g., 20'
                              type='text'
                              onChange={(e) => {
                                const raw = e.target.value.replace(
                                  /[^\d.]/g,
                                  ''
                                );
                                const num = parseFloat(raw);

                                field.onChange(
                                  raw === '' || isNaN(num) ? 0 : num
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                      <FormLabel className='flex shrink-0'>
                        Description (Optional)
                      </FormLabel>

                      <FormControl>
                        <Textarea
                          className='resize-none'
                          rows={4}
                          placeholder="Brief description of the voucher's purpose or offer."
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardComponent>

              {/* usage */}
              <CardComponent
                title={
                  <div className='space-y-2'>
                    <Typography.H4>Usage & Validity</Typography.H4>
                    <Typography.Muted className='font-normal'>
                      Define when and how often this voucher can be used.
                    </Typography.Muted>
                  </div>
                }
                cardContentClass='space-y-4'
              >
                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='max_redemptions'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Usage Limit</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='e.g., 100 (leave empty for unlimited)'
                              type='number'
                              onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const raw = e.target.value.replace(
                                  /[^\d.]/g,
                                  ''
                                );
                                field.onChange(
                                  raw === '' ? undefined : Number(raw)
                                );
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of times this voucher can be redeemed
                            across all customers.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='redeem_limit_per_user'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Usage Limit Per User
                            <span className='text-destructive'> *</span>
                          </FormLabel>
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='e.g., Once' />
                              </SelectTrigger>
                              <SelectContent>
                                {redeemPerUser?.map((item) => (
                                  <SelectItem key={item} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Maximum number of times a single User can redeem
                            this voucher.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='start_date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Start Date
                            <span className='text-destructive'> *</span>
                          </FormLabel>
                          <FormControl>
                            <DateSelector
                              min={moment().tz(timezone).format()}
                              selected={field.value}
                              onSelect={(val) => {
                                field.onChange(val);
                                form.setValue('end_date', '');
                                form.setError('end_date', {
                                  message: fieldValidation('End Date'),
                                });
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Voucher becomes active from this Date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='end_date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            End Date
                            <span className='text-destructive'> *</span>
                          </FormLabel>
                          <FormControl>
                            <DateSelector
                              min={moment(form.watch('start_date')).format()}
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Voucher becomes active from this Date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardComponent>

              <Button
                disabled={state.isLoading}
                className='w-full'
                type='submit'
              >
                {state.isLoading && <Loader className='animate-spin' />}
                {voucherData?.code ? 'Update' : 'Create'}
              </Button>
            </form>
          </Form>
        </div>
        <div className='lg:col-span-4 col-span-12'>
          <Card className='shadow-2xl rounded-2xl border  overflow-hidden w-full'>
            {/* Logo */}
            <CardHeader>
              <Typography.H1 className='text-center'>
                {form.watch('name')}
              </Typography.H1>
              <Typography.Muted className='text-center'>
                {form.watch('description')}
              </Typography.Muted>
            </CardHeader>

            {/* Voucher Content */}
            <CardContent className='p-6 space-y-6'>
              {/* Coupon Code */}
              <div className='border-2 border-dashed border-vpro-purple-300 dark:border-vpro-purple-700 bg-vpro-purple-50/60 dark:bg-vpro-purple-950/40 rounded-xl p-6 text-center space-y-3 shadow-inner'>
                <div className='w-full flex items-center justify-center gap-2'>
                  <Typography.H3>{voucherCode}</Typography.H3>
                  <CopyButton content={voucherCode} size='sm' />
                </div>
                <Typography.H2 className='font-black'>
                  {form.watch('discount_value')}{' '}
                  {form.watch('discount_type')
                    ? discountSymbol[
                        form.watch('discount_type') as DiscountType
                      ](user.organization.currency_symbol)
                    : null}{' '}
                  OFF
                </Typography.H2>
                <div className='text-sm text-vpro-purple-500 dark:text-vpro-purple-400 italic'>
                  Minimun Amount of Purchase {form.watch('min_order_amount')}{' '}
                  {user.organization.currency_symbol}
                </div>
                <Typography.H6 className='text-xs text-muted-foreground'>
                  Valid From &nbsp;
                  {moment(form.watch('start_date')).format('ll')}
                </Typography.H6>{' '}
                <Typography.H6 className='text-xs text-muted-foreground'>
                  Valid until &nbsp;
                  {moment(form.watch('end_date')).format('ll')}
                </Typography.H6>
              </div>

              {/* Additional Details */}
              <div className='space-y-2 text-sm text-vpro-gray-600 dark:text-vpro-gray-300'>
                <Typography.P className='flex items-center gap-2'>
                  {!form.watch('max_redemptions') ? (
                    <>
                      <Infinity className='h-4 w-4 text-emerald-600' />
                      <span> Voucher can be Redeemed Unlimited Times</span>
                    </>
                  ) : (
                    <span>
                      ⏳ Voucher can be Redeemed up to &nbsp;
                      {form.watch('max_redemptions')} Times
                    </span>
                  )}
                </Typography.P>
                <Typography.P className='flex items-center gap-2'>
                  {form.watch('redeem_limit_per_user') === redeemPerUser[1] ? (
                    <>
                      <Infinity className='h-4 w-4 text-emerald-600' />
                      <span>
                        Redeemable {form.watch('redeem_limit_per_user')} Times
                        Per User
                      </span>
                    </>
                  ) : (
                    <span>
                      ⏳ {form.watch('redeem_limit_per_user')} For Only User
                    </span>
                  )}
                </Typography.P>

                <p>📌 Redeem online or in-store</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoucherCreate;
