'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Typography } from '@/global/components/typography/typography';
import CardComponent from '@/global/components/card/card-component';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { smtpSchema } from '../schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ISmtpGet } from '../model-interfaces/interfaces';
import { createOrganizationSmtp } from '../actions/services';
import { toast } from 'sonner';
import { revalidateOrganizationPage } from '../../[organization-slug]/components/revalidate-path';
import { Loader } from 'lucide-react';

export default function SMTPSettings({ smtpData }: { smtpData: ISmtpGet }) {
  const [state, setState] = useState({
    isLoading: false,
  });
  const form = useForm<z.infer<typeof smtpSchema>>({
    resolver: zodResolver(smtpSchema),
    mode: 'all',
    defaultValues: { ...smtpData },
  });

  useEffect(() => {
    if (smtpData?.id) {
      form.reset(smtpData);
    }
  }, [form, smtpData]);

  async function onSubmit(values: z.infer<typeof smtpSchema>) {
    setState((prev) => ({ ...prev, isLoading: true }));
    const res = await createOrganizationSmtp(values);
    await revalidateOrganizationPage();
    setState((prev) => ({ ...prev, isLoading: false }));
    if (res) {
      if (res?.error) {
        toast.error(res.error.message);
      } else {
        toast.success(res?.message);
      }
    }
    // TODO: send to backend API
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }
  return (
    <div className='max-full mx-auto space-y-8'>
      {/* Enable Custom SMTP */}
      <Card className='p-6'>
        <div className='flex items-center justify-between gap-6'>
          <div className='col-span-1'>
            <Typography.H3>Configure Custom SMTP</Typography.H3>
            <Typography.P className='text-sm text-muted-foreground'>
              Emails will be sent using your custom SMTP provider.
            </Typography.P>
          </div>

          {/* <div className='col-span-2 flex items-center'>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div> */}
        </div>
      </Card>

      <CardComponent cardContentClass='space-y-4'>
        {/* Sender details */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={onReset}
            className='space-y-6 w-full'
          >
            <Card className='p-6 rounded-none'>
              <div className='grid grid-cols-3 gap-6'>
                <div>
                  <Typography.H3>Sender details</Typography.H3>
                  <Typography.P className='text-sm text-muted-foreground'>
                    Configure the sender information for your emails.
                  </Typography.P>
                </div>
                <div className='col-span-2 space-y-4 gap-8'>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='sender_email'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>
                            Sender Email
                          </FormLabel>

                          <div className='w-full space-y-2'>
                            <FormControl>
                              <Input
                                placeholder='e.g. admin@yourdomain.com'
                                type='text'
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='sender_name'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>
                            Sender name
                          </FormLabel>

                          <div className='w-full space-y-2'>
                            <FormControl>
                              <Input
                                placeholder='e.g. MyApp Notifications'
                                type='text'
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* SMTP Provider Settings */}
            <Card className='p-6 rounded-none'>
              <div className='grid grid-cols-3 gap-6'>
                <div>
                  <Typography.H3>SMTP Provider Settings</Typography.H3>
                  <Typography.P className='text-sm text-muted-foreground'>
                    Your SMTP credentials will always be encrypted in our
                    database.
                  </Typography.P>
                </div>
                <div className='col-span-2 grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='host'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>Host</FormLabel>

                          <div className='w-full space-y-2'>
                            <FormControl>
                              <Input
                                placeholder='smtp.mailprovider.com'
                                type='text'
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='port'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>Port</FormLabel>

                          <div className='w-full space-y-2'>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder='e.g., 465'
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

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='username'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>
                            Username
                          </FormLabel>

                          <div className='w-full space-y-2'>
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete='new-password'
                                placeholder='SMTP Username'
                                type='text'
                              />
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                          <FormLabel className='flex shrink-0'>
                            Password
                          </FormLabel>

                          <div className='w-full space-y-2'>
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete='new-password'
                                placeholder='SMTP Password'
                                type='password'
                              />
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Save button */}

            <div className='w-full flex justify-end'>
              <Button type='submit' disabled={state.isLoading}>
                {state.isLoading && <Loader className='animate-spin' />}
                Configure SMTP Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardComponent>
    </div>
  );
}
