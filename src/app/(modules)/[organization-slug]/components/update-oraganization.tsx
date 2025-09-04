'use client';

import React, { useState } from 'react';
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
import { Loader } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import RadioCards from '@/global/components/radio-button/radio-card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { revalidateOrganizationPage } from './revalidate-path';
import { organizationSchema } from '../schema/schema';
import { updateMyOrganizationService } from '../actions-services/services';
import {
  currencies,
  industries,
  industryTypes,
  timezonesWithOffset,
} from '../helpers/config';
import { IOrganizationGet } from '../model-interface/interfaces';
import { toast } from 'sonner';

interface IProps {
  orgData: IOrganizationGet;
}
const UpdateOraganization = ({ orgData }: IProps) => {
  const [state, setState] = useState({
    isLoading: false,
  });

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    mode: 'all',
    defaultValues: { ...orgData, description: orgData?.description ?? '' },
  });

  async function onSubmit(values: z.infer<typeof organizationSchema>) {
    setState((prev) => ({ ...prev, isLoading: true }));
    const res = await updateMyOrganizationService(values);
    await revalidateOrganizationPage();
    if (res?.code === 200) {
      toast.success(res?.message);
    } else {
      toast.error(res?.error?.message);
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <>
      <Card>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-3xl font-bold text-gray-900'>
            Organization Information
          </CardTitle>
          <CardDescription className='text-sm text-gray-600'>
            Update your organization&apos;s basic information
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
                  <>
                    <div className='col-span-6'>
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                            <FormLabel className='flex shrink-0'>
                              Organizations Name
                            </FormLabel>

                            <FormControl>
                              <Input
                                key='text-input-0'
                                placeholder='Acme Solution'
                                type='text'
                                id='name'
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='col-span-6'>
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
                    </div>
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
                                {...field}
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
                                    <SelectItem key={tz.value} value={tz.value}>
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
                                rows={8}
                                className='resize-none'
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                </div>

                <Button
                  disabled={state.isLoading}
                  className='w-full'
                  type='submit'
                >
                  {state.isLoading && <Loader className='animate-spin' />}
                  Save
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UpdateOraganization;
