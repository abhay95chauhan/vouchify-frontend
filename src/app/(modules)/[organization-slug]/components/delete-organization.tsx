'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { deleteAllVouchersService } from '@/app/(modules)/vouchers/actions/services';
import { toast } from 'sonner';
import AlertModal from '@/global/components/modal/alert-modal';
import { Typography } from '@/global/components/typography/typography';

const DeleteOrganization = () => {
  const [state, setState] = useState({
    showDeleteAllVouchersModal: false,
    confirmText: '',
  });

  const handleDeleteAllVouchers = async () => {
    try {
      const res = await deleteAllVouchersService();
      if (res?.error) {
        toast.error(res?.error.message);
      } else {
        toast.success(res?.message || 'All vouchers deleted successfully');
      }
      setState((prev) => ({
        ...prev,
        showDeleteAllVouchersModal: false,
        confirmText: '',
      }));
    } catch (error) {
      console.log(error, 'error');
      toast.error('Failed to delete all vouchers');
    }
  };

  const openDeleteAllVouchersModal = () => {
    setState((prev) => ({ ...prev, showDeleteAllVouchersModal: true }));
  };

  const closeDeleteAllVouchersModal = () => {
    setState((prev) => ({
      ...prev,
      showDeleteAllVouchersModal: false,
      confirmText: '',
    }));
  };

  const isDeleteAllEnabled = state.confirmText === 'delete-all';

  return (
    <>
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='text-destructive flex items-center'>
            <AlertTriangle className='mr-2 h-5 w-5' />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 border border-destructive rounded-lg'>
              <div>
                <Typography.H5 className='text-destructive'>
                  Delete All Vouchers
                </Typography.H5>
                <Typography.Muted>
                  Permanently delete all vouchers in this organization
                </Typography.Muted>
              </div>
              <Button
                variant='destructive'
                onClick={openDeleteAllVouchersModal}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete All Vouchers
              </Button>
            </div>
            <div className='flex items-center justify-between p-4 border border-destructive rounded-lg'>
              <div>
                <Typography.H5 className='text-destructive'>
                  Delete Organization
                </Typography.H5>
                <Typography.Muted>
                  Permanently delete this organization and all its data
                </Typography.Muted>
              </div>
              <Button variant='destructive'>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete Organization
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete All Vouchers Modal */}
      <AlertModal
        deleteFn={handleDeleteAllVouchers}
        showModal={state.showDeleteAllVouchersModal}
        onClose={closeDeleteAllVouchersModal}
        btnTitle='Delete All Vouchers'
        subTitle='This action cannot be undone. This will permanently delete all vouchers in this organization.'
        disableDelete={!isDeleteAllEnabled}
        anotherData={
          <div className='space-y-2 w-full mt-4'>
            <label className='text-sm font-medium'>
              To confirm, type <span className='font-bold'>delete-all</span> in
              the box below:
            </label>
            <Input
              type='text'
              placeholder='Type delete-all to confirm'
              value={state.confirmText}
              onChange={(e) =>
                setState((prev) => ({ ...prev, confirmText: e.target.value }))
              }
              className='w-full'
            />
          </div>
        }
      />
    </>
  );
};

export default DeleteOrganization;
