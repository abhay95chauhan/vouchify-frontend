'use client';
import { useState } from 'react';
import { Typography } from '../typography/typography';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

interface IProps {
  deleteFn: () => void | Promise<void>;
  onClose: () => void;
  showModal: boolean;
  showAlertIcon?: boolean;
  subTitle?: string | React.ReactNode;
  anotherData?: React.ReactNode;
  btnTitle?: string;
  showCloseBtn?: boolean;
}
const AlertModal = (props: Readonly<IProps>) => {
  const [state, setState] = useState({
    isLoading: false,
  });

  const deleteIt = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await props.deleteFn();
    setState((prev) => ({ ...prev, isLoading: false }));
  };
  return (
    <Dialog open={props.showModal}>
      <DialogContent className={`overflow-y-auto`}>
        <DialogTitle asChild>
          <div className='flex flex-col items-center gap-4'>
            <Typography.H1 className='font-bold text-center'>
              Caution
            </Typography.H1>
            <Typography.P className='font-medium text-center'>
              {props.subTitle}
            </Typography.P>

            {props.showAlertIcon !== false && (
              <div className='flex justify-center'>
                <CircleAlert size={100} className='text-destructive' />
              </div>
            )}

            {props.anotherData}
          </div>
        </DialogTitle>

        <DialogFooter>
          {props.showCloseBtn !== false && !state.isLoading && (
            <Button
              className='w-full rounded-[0.25rem]'
              onClick={props.onClose}
              variant='outline'
            >
              Close
            </Button>
          )}
          <Button
            className='w-full rounded-[0.25rem] bg-destructive hover:bg-destructive/90'
            disabled={state.isLoading}
            onClick={deleteIt}
          >
            {props.btnTitle || 'Apply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
