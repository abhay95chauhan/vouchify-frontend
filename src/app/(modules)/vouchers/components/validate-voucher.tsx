import { CustomModal } from '@/global/components/modal/custom-modal';
import { useForm } from 'react-hook-form';
import { validateVoucherPostSchema } from '../schema/schema';
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
import { validateVoucherService } from '../actions/services';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '@/redux/hook';
import { cn } from '@/lib/utils';
import { discountSymbol, discountType } from '../helpers/config';
import { DiscountType } from '../interface-model/interfaces';
import { Separator } from '@/components/ui/separator';

export interface IProps {
  vCode: string;
  discountType: DiscountType;
  showModal: boolean;
  oncePerUser: boolean;
  closeModal: () => void;
}

export default function ValidateVoucher(props: IProps) {
  const { user } = useAppSelector((state) => state.user);

  const [state, setState] = useState({
    finalAmount: null,
    discount: null,
    error: '',
  });

  const form = useForm<z.input<typeof validateVoucherPostSchema>>({
    resolver: zodResolver(validateVoucherPostSchema),
    mode: 'all',
    defaultValues: {
      code: props.vCode,
    },
  });

  async function onSubmit(values: z.infer<typeof validateVoucherPostSchema>) {
    const res = await validateVoucherService({
      ...values,
    });
    if (res?.code === 200) {
      // You can also set state for showing discount details
      setState((prev) => ({
        ...prev,
        discount: res.data.discount,
        finalAmount: res.data.finalAmount,
        error: '',
      }));
    } else {
      // API returned error (400, etc.)
      setState((prev) => ({
        ...prev,
        discount: null,
        finalAmount: null,
        error: res?.error?.message,
      }));
    }
  }

  const onClose = () => {
    form.reset();
    form.clearErrors();
    setState((prev) => ({
      ...prev,
      discount: null,
      finalAmount: null,
      error: '',
    }));
    props.closeModal();
  };
  return (
    <CustomModal
      title={'Validate Voucher'}
      loading={false}
      showModal={props.showModal}
      size='xl'
      buttonLabel='Validate'
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
            name='code'
            render={({ field }) => (
              <FormItem className='col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start'>
                <FormLabel className='flex shrink-0'>
                  Voucher Code <span className='text-destructive'>*</span>
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder='e.g., SUMMER20, FREESHIP'
                    type='text'
                    disabled
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='orderAmount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount ({user.organization.currency_symbol}){' '}
                  <span className='text-destructive'> *</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='e.g., 20'
                    type='text'
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      const num = parseFloat(raw);
                      field.onChange(raw === '' || isNaN(num) ? 0 : num);
                      setState((prev) => ({
                        ...prev,
                        discount: null,
                        finalAmount: null,
                        error: '',
                      }));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {props.oncePerUser ? (
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex shrink-0'>
                    Recipient&apos;s Emails
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g., example@example.com' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          {state.discount || state.error ? (
            <Alert
              variant={state.discount ? 'default' : 'destructive'}
              className={cn(
                state.discount ? 'border-success bg-success/8 text-success' : ''
              )}
            >
              {state.discount ? <CheckCircle2Icon /> : <AlertCircleIcon />}
              <AlertTitle>
                {state.discount ? 'Voucher is Valid' : state.error}
              </AlertTitle>
              {state.discount && (
                <AlertDescription className='text-success font-medium'>
                  <ul className={cn(state.discount ? 'text-success' : '')}>
                    <li>Discount Type: {props.discountType}</li>
                    <Separator className='my-1 bg-success/20' />
                    <li>
                      Order Amount: {user.organization.currency_symbol}&nbsp;
                      {form.watch('orderAmount')}
                    </li>
                    <li>
                      Discount: &nbsp;
                      {discountSymbol[discountType[0]]({
                        amount: state.discount,
                        currency: user.organization.currency_symbol,
                      })}
                      &nbsp;
                    </li>

                    <li>
                      Final Payable Amount: {user.organization.currency_symbol}
                      &nbsp;{state.finalAmount}
                    </li>
                  </ul>
                </AlertDescription>
              )}
            </Alert>
          ) : null}
        </form>
      </Form>
    </CustomModal>
  );
}
