'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { toast } from 'sonner';
import Logo from '@/global/components/logo/logo';
import { redirect } from 'next/navigation';
import { loginSchema } from '../schema/schema';
import { loginService } from '../actions-services/services';
import { useState } from 'react';
import { Loader } from 'lucide-react';

export default function LoginForm() {
  const [state, setState] = useState({
    isLoading: false,
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setState((prev) => ({ ...prev, isLoading: true }));
    const res = await loginService(values);

    if (res) {
      if (res?.error) {
        toast.error(res.error.message);
      } else {
        toast.success(res.message);
        if (res?.data?.organization_id) {
          redirect('/dashboard');
        } else {
          redirect('/');
        }
      }
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col  p-6 '>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <div className={cn('flex flex-col gap-6')}>
              <div className='flex flex-col items-center gap-2 text-center'>
                <div className='block lg:hidden'>
                  <Logo />
                </div>
                <h1 className='text-2xl font-bold'>Login to your account</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                  Enter your email below to login to your account
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  onReset={onReset}
                  className='space-y-6 @container'
                >
                  <div className='grid grid-cols-12 gap-6'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>Email</FormLabel>

                          <div className='w-full space-y-2'>
                            <FormControl>
                              <div className='relative w-full'>
                                <Input
                                  placeholder='example@example.com'
                                  type='text'
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              <FormMessage />
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>
                            Password
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder='********'
                              type='password'
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    disabled={state.isLoading}
                    type='submit'
                    className='w-full'
                  >
                    {state.isLoading && <Loader className='animate-spin' />}
                    Login
                  </Button>
                </form>
              </Form>
              <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <a href='#' className='underline underline-offset-4'>
                  Sign up
                </a>
              </div>
              <Button className='w-full' variant={'outline'}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 533.5 544.3'
                  width='24'
                  height='24'
                >
                  <path
                    fill='#4285f4'
                    d='M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272v95.2h146.9c-6.4 34.6-25.5 63.9-54.4 83.4v68h87.7c51.3-47.2 81.3-116.6 81.3-196.3z'
                  />
                  <path
                    fill='#34a853'
                    d='M272 544.3c73.5 0 135.3-24.3 180.4-65.9l-87.7-68c-24.4 16.3-55.8 25.8-92.7 25.8-71.3 0-131.8-48.1-153.5-112.7H28.8v70.8C73.8 486 166.4 544.3 272 544.3z'
                  />
                  <path
                    fill='#fbbc04'
                    d='M118.5 323.5c-10.4-30.6-10.4-63.6 0-94.2v-70.8H28.8c-39.6 77.7-39.6 168.1 0 245.8l89.7-70.8z'
                  />
                  <path
                    fill='#ea4335'
                    d='M272 107.7c39.9-.6 78.1 14.1 107.4 41.2l80.1-80.1C407.3 24.9 344.5-.1 272 0 166.4 0 73.8 58.3 28.8 151.4l89.7 70.8C140.2 155.8 200.7 107.7 272 107.7z'
                  />
                </svg>
                Login with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(
      135deg,
      oklch(0.92 0.05 280),
      oklch(0.95 0.03 340)
    )`,
        }}
        className='bg-muted relative h-screen hidden lg:flex items-center justify-center'
      >
        <Card className='shadow-2xl rounded-2xl border border-vpro-gray-200 dark:border-vpro-gray-700 overflow-hidden max-w-sm w-full'>
          <CardHeader className='bg-gradient-to-b from-vpro-purple-100 via-vpro-purple-50 to-transparent dark:from-vpro-purple-900 dark:via-vpro-purple-950 dark:to-transparent'>
            <CardTitle className='flex flex-col items-center justify-center gap-6'>
              <Logo />
              <p className='text-lg font-semibold text-vpro-purple-700 dark:text-vpro-purple-200 tracking-wide'>
                Vouchify Exclusive Offer
              </p>
            </CardTitle>
          </CardHeader>

          {/* Voucher Content */}
          <CardContent className='p-6 space-y-6'>
            {/* Coupon Code */}
            <div className='border-2 border-dashed border-vpro-purple-300 dark:border-vpro-purple-700 bg-vpro-purple-50/60 dark:bg-vpro-purple-950/40 rounded-xl p-6 text-center space-y-3 shadow-inner'>
              <div className='text-4xl font-extrabold text-vpro-purple-700 dark:text-vpro-purple-200 tracking-wide'>
                SUMMER20
              </div>
              <div className='text-2xl font-bold text-vpro-purple-600 dark:text-vpro-purple-300'>
                20% OFF
              </div>
              <div className='text-sm text-vpro-purple-500 dark:text-vpro-purple-400 italic'>
                Summer Sale 2024
              </div>
              <div className='text-xs text-vpro-purple-400 dark:text-vpro-purple-500'>
                Valid until <span className='font-medium'>Aug 31, 2024</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className='space-y-2 text-sm text-vpro-gray-600 dark:text-vpro-gray-300'>
              <p>✅ Applicable on all summer collection items</p>
              <p>💳 Payment via Razorpay, UPI, or Card accepted</p>
              <p>📌 Redeem online or in-store</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
