import { CustomModal } from '@/global/components/modal/custom-modal';
import { Send } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { sendEmailToRecipients } from '../schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export interface IProps {
  title: string;
  showModal: boolean;
  closeModal: () => void;
  onSave: (emails: string) => void;
}

const SendEmailToRecipients = (props: IProps) => {
  const [state, setState] = useState({
    isLoading: false,
  });

  const form = useForm<z.infer<typeof sendEmailToRecipients>>({
    resolver: zodResolver(sendEmailToRecipients),
    mode: 'all',
  });

  const sendEmail = async (values: z.infer<typeof sendEmailToRecipients>) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await props.onSave(values.emails);
    onClose();
  };

  const onClose = () => {
    form.reset();
    form.clearErrors();
    setState((prev) => ({ ...prev, isLoading: false }));
    props.closeModal();
  };

  return (
    <>
      <CustomModal
        title={props.title}
        loading={state.isLoading}
        showModal={props.showModal}
        className='max-w-sm'
        buttonLabel={state.isLoading ? 'Sending...' : 'Send'}
        close={onClose}
        save={form.handleSubmit(sendEmail)}
        icon={<Send />}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(sendEmail)}
            className='space-y-6 w-full'
          >
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name='emails'
                render={({ field }) => (
                  <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                    <FormLabel className='flex shrink-0'>
                      Recipient&apos;s Emails
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
          </form>
        </Form>
      </CustomModal>
    </>
  );
};

export default SendEmailToRecipients;
