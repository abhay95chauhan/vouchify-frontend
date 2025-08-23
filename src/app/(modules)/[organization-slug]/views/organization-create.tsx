'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Logo from '@/global/components/logo/logo';
import { cn } from '@/lib/utils';
import { Building2, Loader } from 'lucide-react';
import { useState } from 'react';
import { organizationSchema } from '../schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import RadioCards from '@/global/components/radio-button/radio-card';
import {
  currencies,
  industries,
  industryTypes,
  timezonesWithOffset,
} from '../helpers/config';
import { createOrganizationAction } from '../actions/actions';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { errorMessages } from '@/global/utils/error-messages';
import moment from 'moment';

export default function OrganizationCreate() {
  const [state, setState] = useState({
    formStep: 1,
    isLoading: false,
  });

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    mode: 'all',
    defaultValues: {
      organization_type: industryTypes[0].value,
    },
  });

  async function onSubmit(values: z.infer<typeof organizationSchema>) {
    setState((prev) => ({ ...prev, isLoading: true }));
    const res = await createOrganizationAction({
      ...values,
      currency_symbol: values.currency_symbol as string,
      subcription_expire: moment()
        ?.tz(values?.timezone)
        .add(1, 'months')
        .toDate(),
    });
    if (res) {
      if (res?.error) {
        toast.error(res.error.message);
      } else {
        toast.success(errorMessages.organization.success.create);
        redirect('/dashboard');
      }
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div
      className='flex items-center justify-center min-h-screen '
      style={{
        minHeight: '100vh',
        background: `linear-gradient(
      135deg,
      oklch(0.92 0.05 280),
      oklch(0.95 0.03 340)
    )`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Card className='max-w-3xl w-full'>
        <CardHeader className='text-center space-y-2'>
          <div className='mx-auto'>
            <Logo />
          </div>

          <CardTitle className='text-3xl font-bold text-gray-900'>
            Create Your Organization
          </CardTitle>
          <CardDescription className='text-lg text-gray-600'>
            Set up your workspace to start managing promotions and campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={onReset}
                className='space-y-6 w-full'
              >
                <div className='grid grid-cols-12 gap-4'>
                  {state.formStep == 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Organizations Name
                            </FormLabel>

                            <div className='w-full space-y-2'>
                              <FormControl>
                                <div className='relative w-full'>
                                  <Input
                                    key='text-input-0'
                                    placeholder='Acme Solution'
                                    type='text'
                                    id='name'
                                    className=' ps-9'
                                    {...field}
                                  />
                                  <div
                                    className={
                                      'text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3'
                                    }
                                  >
                                    <Building2
                                      className='size-4'
                                      strokeWidth={2}
                                    />
                                  </div>
                                </div>
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='industry'
                        render={({ field }) => (
                          <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Industry
                            </FormLabel>

                            <div className='w-full space-y-2'>
                              <FormControl>
                                <Select
                                  key='select-0'
                                  {...field}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className='w-full '>
                                    <SelectValue placeholder='Software' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {industries?.map((ind) => (
                                      <SelectItem
                                        key={ind.value}
                                        value={ind.value}
                                      >
                                        {ind.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='organization_type'
                        render={({ field }) => (
                          <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Industry Type
                            </FormLabel>

                            <div className='w-full space-y-2'>
                              <FormControl>
                                <RadioCards
                                  options={industryTypes.map((type) => ({
                                    ...type,
                                    icon: type.icon ? <type.icon /> : null,
                                  }))}
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {state.formStep == 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                          <FormItem className='col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Currency
                            </FormLabel>

                            <div className='w-full space-y-2'>
                              <FormControl>
                                <Select
                                  key='select-0'
                                  {...field}
                                  onValueChange={(val) => {
                                    const findSymbol = currencies.find(
                                      (cur) => cur.value === val
                                    );
                                    field.onChange(val);
                                    form.setValue(
                                      'currency_symbol',
                                      findSymbol?.symbol
                                    );
                                  }}
                                >
                                  <SelectTrigger className='w-full '>
                                    <SelectValue placeholder='Indian Rupee (INR)' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currencies?.map((cur) => (
                                      <SelectItem
                                        key={cur.value}
                                        value={cur.value}
                                      >
                                        {cur.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='timezone'
                        render={({ field }) => (
                          <FormItem className='col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Timezone
                            </FormLabel>

                            <div className='w-full space-y-2'>
                              <FormControl>
                                <Select
                                  key='select-0'
                                  {...field}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className='w-full '>
                                    <SelectValue placeholder='Asia/Kolkata' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timezonesWithOffset?.map((tz) => (
                                      <SelectItem
                                        key={tz.value}
                                        value={tz.value}
                                      >
                                        {tz.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='website'
                        render={({ field }) => (
                          <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Website
                            </FormLabel>

                            <div className='w-full space-y-2'>
                              <FormControl>
                                <Input
                                  key='text-input-0'
                                  placeholder='http://example.com'
                                  type='text'
                                  id='name'
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Description
                            </FormLabel>

                            <div className='w-full'>
                              <FormControl>
                                <Textarea
                                  key='textarea-0'
                                  id='description'
                                  placeholder='Tell us About Your Company...'
                                  className=''
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
                <div
                  className={cn(
                    state.formStep > 1 ? 'grid-cols-2' : 'grid-cols-1',
                    'grid gap-2 w-full'
                  )}
                >
                  {state.formStep > 1 && (
                    <Button
                      className='w-full'
                      variant={'outline'}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          formStep: prev.formStep - 1,
                        }))
                      }
                    >
                      Back
                    </Button>
                  )}
                  {state.formStep !== 2 && (
                    <Button
                      className='w-full'
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          formStep: prev.formStep + 1,
                        }))
                      }
                    >
                      Next
                    </Button>
                  )}
                  {state.formStep === 2 && (
                    <Button
                      disabled={state.isLoading}
                      className='w-full'
                      type='submit'
                    >
                      {state.isLoading && <Loader className='animate-spin' />}
                      Create
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
