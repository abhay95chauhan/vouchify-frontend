import { cn } from '@/lib/utils';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Loader2, X } from 'lucide-react';

interface IProps {
  crossClose?: () => void;
  close: () => void;
  save: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  showModal: boolean;
  disableBtn?: boolean;
  loading: boolean;
  showCloseBtn?: boolean;
  showCrossCloseBtn?: boolean;
  showSaveBtn?: boolean;
  title: string;
  desc?: string;
  buttonLabel?: string;
  clearButtonLabel?: string;
  className?: string;
  childrenClass?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function CustomModal(props: Readonly<IProps>) {
  const sizeWidth: Record<NonNullable<IProps['size']>, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    full: 'sm:max-w-[90vw]',
  };
  const modalSize = props.size ? sizeWidth[props.size] : sizeWidth.md;
  return (
    <Dialog open={props.showModal}>
      <DialogContent
        className={cn(
          'w-[95vw] sm:w-full', // responsive: almost full on mobile
          modalSize, // apply size from prop on larger screens
          props.className // allow manual overrides
        )}
      >
        <DialogHeader>
          {/* Title + Close button row */}
          <div className='flex justify-between items-center w-full'>
            <DialogTitle className='text-lg sm:text-xl md:text-2xl font-semibold'>
              {props.title}
            </DialogTitle>
            {props.showCrossCloseBtn !== false && !props.loading && (
              <DialogClose
                onClick={() => {
                  if (props.crossClose) {
                    props.crossClose();
                  } else {
                    props.close();
                  }
                }}
                className='rounded-full p-1 hover:bg-gray-100 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </DialogClose>
            )}
          </div>

          {props.desc && (
            <DialogDescription className='text-sm'>
              {props.desc}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={cn(props.childrenClass, 'my-2')}>{props.children}</div>

        <DialogFooter
          className={`${
            props.showCloseBtn !== false && props.showSaveBtn !== false
              ? `grid grid-cols-${props.loading ? '1' : '2'} gap-2`
              : ''
          }`}
        >
          {props.showCloseBtn !== false && !props.loading && (
            <Button
              className='w-full rounded-[0.25rem]'
              onClick={props.close}
              variant='outline'
            >
              {props.clearButtonLabel || 'Close'}
            </Button>
          )}

          {props.showSaveBtn !== false && (
            <Button
              className='w-full rounded-[0.25rem]'
              disabled={props.loading || props.disableBtn}
              onClick={props.save}
            >
              {props.loading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                props.icon && props.icon
              )}
              {props.buttonLabel || 'Save'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
