import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import moment from 'moment';
import { IOrganizationGet } from '../model-interface/interfaces';
import { Typography } from '@/global/components/typography/typography';

interface IProps {
  orgData: IOrganizationGet;
}

const BillingOrganization = ({ orgData }: IProps) => {
  return (
    <>
      <Card>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-3xl font-bold text-gray-900'>
            Current Plan
          </CardTitle>
          <CardDescription className='text-sm text-gray-600'>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div>
              <h3 className='font-semibold'>
                {orgData?.subcription.name} Plan ({orgData?.subcription_status})
              </h3>
              <Typography.Muted className='text-sm capitalize'>
                {orgData?.currency_symbol}&nbsp;
                {orgData?.subcription?.price[orgData?.subscription_period]}
                &nbsp;/&nbsp;
                {orgData?.subscription_period}
              </Typography.Muted>
            </div>
            <Button variant='outline'>Upgrade Plan</Button>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label>Next Billing Date</Label>
              <Typography.Muted className='text-sm'>
                {moment(orgData?.subcription_expire).format('ll')}
              </Typography.Muted>
            </div>
            <div className='space-y-2'>
              <Label>Billing Email</Label>
              <Typography.Muted className='text-sm'>
                {orgData?.email}
              </Typography.Muted>
            </div>
            <div className='space-y-2'>
              <Label>Payment Method</Label>
              <Typography.Muted className='text-sm'>
                •••• •••• •••• 4242
              </Typography.Muted>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BillingOrganization;
