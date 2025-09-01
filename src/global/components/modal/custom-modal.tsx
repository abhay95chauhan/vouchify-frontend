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
  showModal: boolean;
  disableBtn?: boolean;
  loading: boolean;
  showCloseBtn?: boolean;
  showSaveBtn?: boolean;
  title: string;
  desc?: string;
  buttonLabel?: string;
  clearButtonLabel?: string;
  className?: string;
}

export function CustomModal(props: Readonly<IProps>) {
  return (
    <Dialog open={props.showModal}>
      <DialogContent
        className={`w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl ${
          props.className || ''
        }`}
      >
        <DialogHeader className='space-y-2'>
          {/* Title + Close button row */}
          <div className='flex justify-between items-center w-full'>
            <DialogTitle className='text-lg sm:text-xl md:text-2xl font-semibold'>
              {props.title}
            </DialogTitle>
            {props.showCloseBtn !== false && !props.loading && (
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
            <DialogDescription className='text-sm sm:text-base'>
              {props.desc}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className='my-2'>{props.children}</div>

        <DialogFooter
          className={`${
            props.showCloseBtn !== false
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
              {props.loading && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {props.buttonLabel || 'Save'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
