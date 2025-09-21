'use client';
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

import ReactSelectComponent from '@/global/components/select/react-select';

export interface IProps {
  title: string;
  description?: string;
  showModal: boolean;
  closeModal: () => void;
  onSave: (emails: string | string[]) => void;
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
        desc={props.description}
        loading={state.isLoading}
        showModal={props.showModal}
        size='2xl'
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
                  <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-1 items-start'>
                    <FormLabel className='flex shrink-0'>
                      Recipient&apos;s Emails
                    </FormLabel>

                    <div className='w-full'>
                      <FormControl>
                        <ReactSelectComponent
                          value={
                            field.value?.length
                              ? field.value?.map((item) => ({
                                  label: item,
                                  value: item,
                                }))
                              : null
                          }
                          onChange={(data) => {
                            const values = Array.isArray(data)
                              ? data.map((item) => item.value)
                              : data
                              ? [data.value]
                              : [];

                            field.onChange(values);
                          }}
                          placeholder='Create e.g., example@example.com'
                          isMulti
                          isCreatable
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
