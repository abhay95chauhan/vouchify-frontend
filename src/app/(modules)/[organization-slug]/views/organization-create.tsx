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
import { CheckCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { organizationSchema } from '../schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import RadioCards from '@/global/components/radio-button/radio-card';
import {
  currencies,
  formSteps,
  industries,
  industryTypes,
  timezonesWithOffset,
} from '../helpers/config';
import { createOrganizationService } from '../actions-services/services';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import moment from 'moment';
import Pricing from '@/components/ui/pricing';
import { ISubscriptionPeriod } from '../../subcriptions/model-interfaces/interfaces';

export default function OrganizationCreate() {
  const [state, setState] = useState({
    formStep: 1,
    isLoading: false,
    selectedPlanId: '',
    subscriptionPeriod: '' as ISubscriptionPeriod,
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
    const res = await createOrganizationService({
      ...values,
      subcription_id: state.selectedPlanId,
      subscription_period: state.subscriptionPeriod,
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
        toast.success(res?.message);
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
      className='flex flex-col items-center justify-center min-h-screen'
      style={{
        minHeight: '100vh',
        background: `linear-gradient(
      135deg,
      oklch(0.92 0.05 280),
      oklch(0.95 0.03 340)
    )`,
      }}
    >
      <div className='relative my-6 max-w-3xl container mx-auto '>
        {/* Step Icons + Titles */}
        <div className='flex items-center justify-between mb-2 relative'>
          {formSteps.map((step) => (
            <div
              key={step.id}
              className='flex flex-col items-center text-center relative z-10 w-1/3'
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                  state.formStep > step.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : state.formStep === step.id
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card border-border text-muted-foreground'
                )}
              >
                {state.formStep > step.id ? (
                  <CheckCircle className='w-6 h-6' />
                ) : (
                  <step.icon className='w-6 h-6' />
                )}
              </div>
              <div className='mt-2'>
                <p
                  className={cn(
                    'text-sm font-medium transition-colors',
                    state.formStep >= step.id
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p className='text-xs text-muted-foreground hidden sm:block'>
                  {step.description}
                </p>
              </div>
            </div>
          ))}

          {/* Progress Line */}
          <div className='absolute top-6 left-[120px] right-[120px] h-0.5 bg-border -z-0'>
            <div
              className='h-full bg-primary transition-all duration-500 ease-out'
              style={{
                width: `${Math.max(
                  0,
                  ((state.formStep - 1) / (formSteps.length - 1)) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      <Card className='max-w-3xl w-full mb-6'>
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
                {state.formStep === 3 && (
                  <Pricing
                    onSelecPlan={(subData: {
                      subId: string;
                      period: ISubscriptionPeriod;
                    }) =>
                      setState((prev) => ({
                        ...prev,
                        selectedPlanId: subData.subId,
                        subscriptionPeriod: subData.period,
                      }))
                    }
                  />
                )}
                {(state.formStep == 1 || state.formStep == 2) && (
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
                                <span className='text-destructive'>*</span>
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
                        <FormField
                          control={form.control}
                          name='industry'
                          render={({ field }) => (
                            <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                              <FormLabel className='flex shrink-0'>
                                Industry
                                <span className='text-destructive'>*</span>
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
                                <span className='text-destructive'>*</span>
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
                                <span className='text-destructive'>*</span>
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
                                <span className='text-destructive'>*</span>
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
                )}

                <div
                  className={cn(
                    state.formStep > 1 ? 'grid-cols-2' : 'grid-cols-1',
                    'grid gap-2 w-full'
                  )}
                >
                  {state.formStep > 1 && (
                    <Button
                      type='button'
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
                  {state.formStep !== 3 && (
                    <Button
                      className='w-full'
                      type='button'
                      onClick={() => {
                        if (state.formStep === 2 && !form.formState.isValid) {
                          return;
                        }
                        setState((prev) => ({
                          ...prev,
                          formStep: prev.formStep + 1,
                        }));
                      }}
                    >
                      Next
                    </Button>
                  )}
                  {state.formStep === 3 && (
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
