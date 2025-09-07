'use client';
import { CustomModal } from '@/global/components/modal/custom-modal';
import { useForm } from 'react-hook-form';
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
import { useEffect, useState } from 'react';
import { emailTemplateSchema } from '../schema/schema';
import {
  createEmailTemplatesService,
  updateEmailTemplatesService,
} from '../actions/services';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fakeHtml } from '../helpers/config';
import { IEmailTemplate } from '../model-interfaces/interfaces';
import { getAllEmailTemplatesAction } from '../actions/actions';
import { useAppDispatch } from '@/redux/hook';

export interface IProps {
  showModal: boolean;
  template?: IEmailTemplate;
  closeModal: () => void;
}

export default function CreateEmailTemplate(props: IProps) {
  const dispatch = useAppDispatch();
  const [state, setState] = useState({
    isLoading: false,
  });

  const form = useForm<z.input<typeof emailTemplateSchema>>({
    resolver: zodResolver(emailTemplateSchema),
    mode: 'all',
    defaultValues: {
      html: fakeHtml,
    },
  });

  useEffect(() => {
    if (props?.template?.id) {
      form.reset(props?.template);
    }
  }, [form, props?.template]);

  async function onSubmit(values: z.infer<typeof emailTemplateSchema>) {
    let res;
    if (props?.template?.id) {
      res = await updateEmailTemplatesService(props?.template?.id, values);
      dispatch(getAllEmailTemplatesAction());
    } else {
      res = await createEmailTemplatesService({
        ...values,
      });
    }

    if (res?.error) {
      toast.error(res?.error?.message);
    } else {
      toast.success(res?.message);
    }
    onClose();
  }

  const onClose = () => {
    form.reset();
    form.clearErrors();
    setState((prev) => ({ ...prev, isLoading: false }));
    props.closeModal();
  };
  return (
    <CustomModal
      desc='Please review the Email Template System guide before adding a new template.'
      title={props?.template?.id ? 'Edit Template' : 'Create Template'}
      loading={state.isLoading}
      showModal={props.showModal}
      buttonLabel={props?.template?.id ? 'Edit' : 'Create'}
      close={onClose}
      save={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 w-full'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                <FormLabel className='flex shrink-0'>
                  Name <span className='text-destructive'>*</span>
                </FormLabel>

                <FormControl>
                  <Input placeholder='e.g., Welcome' type='text' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='subject'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject
                    <span className='text-destructive'> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g., Welcome to Our Platform'
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g., Greeting'
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='html'
            render={({ field }) => (
              <FormItem>
                <FormLabel>HTML (Copy & Paste Your HTML here)</FormLabel>
                <FormControl>
                  <div className='rounded-xl border bg-black/95 text-white overflow-hidden shadow-inner'>
                    <div className='flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-gradient-to-r from-indigo-600/40 to-purple-600/40'>
                      <div className='h-3 w-3 rounded-full bg-red-500' />
                      <div className='h-3 w-3 rounded-full bg-yellow-400' />
                      <div className='h-3 w-3 rounded-full bg-green-500' />
                    </div>
                    <ScrollArea className='h-[30vh] md:h-[30vh] w-full overflow-auto'>
                      <Textarea
                        {...field}
                        className='h-full w-full font-mono text-sm md:text-base border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none'
                      />
                    </ScrollArea>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </CustomModal>
  );
}
