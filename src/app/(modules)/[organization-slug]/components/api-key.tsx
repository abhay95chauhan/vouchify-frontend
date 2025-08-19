'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IOrganizationGet } from '../model-interface/interfaces';
import { Typography } from '@/global/components/typography/typography';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { Eye, EyeClosed, Key, Shield } from 'lucide-react';
import CardComponent from '@/global/components/card/card-component';

interface IProps {
  orgData: IOrganizationGet;
}

const ApiKey = ({ orgData }: IProps) => {
  const [showSecret, setShowSecret] = useState(false);
  return (
    <>
      <Card className='border-primary'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-3xl font-bold text-gray-900'>
            Api Key
          </CardTitle>
          <CardDescription className='text-sm text-gray-600'>
            Manage your Api Keys
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid sm:grid-cols-2 grid-cols-1 gap-8'>
            <div className='space-y-2'>
              <Typography.H5 className='font-semibold'>Api Key</Typography.H5>
              <div className='flex items-center justify-between gap-4 p-4 border border-primary rounded-lg'>
                <Typography.Muted className='text-sm'>
                  {orgData?.api_key}
                </Typography.Muted>
                <CopyButton
                  content={orgData?.api_key}
                  variant='outline'
                  size='sm'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Typography.H5 className='font-semibold'>
                Api Secret
              </Typography.H5>
              <div className='flex items-center justify-between gap-4 p-4 border border-primary rounded-lg'>
                <Typography.Muted className='text-sm'>
                  {showSecret ? (
                    orgData?.api_secret
                  ) : (
                    <p className='-mb-1'>********************</p>
                  )}
                </Typography.Muted>
                <div className='flex items-center gap-2'>
                  {showSecret ? (
                    <EyeClosed
                      className='text-muted-foreground cursor-pointer'
                      size={20}
                      onClick={() => setShowSecret(!showSecret)}
                    />
                  ) : (
                    <Eye
                      className='text-muted-foreground cursor-pointer'
                      size={20}
                      onClick={() => setShowSecret(!showSecret)}
                    />
                  )}

                  <CopyButton
                    content={orgData?.api_secret}
                    variant='outline'
                    size='sm'
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid sm:grid-cols-2 grid-cols-1 gap-4'>
        <CardComponent cardClass='mt-0'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-accent rounded-lg'>
              <Shield className='text-green-600' />
            </div>
            <div>
              <Typography.H3 className='font-semibold'>
                Secure Access
              </Typography.H3>
              <Typography.H6 className='text-muted-foreground'>
                End-to-end encryption
              </Typography.H6>
            </div>
          </div>
        </CardComponent>
        <CardComponent cardClass='mt-0'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Key className='text-blue-600' />
            </div>
            <div>
              <Typography.H3 className='font-semibold'>
                Rate Limit
              </Typography.H3>
              <Typography.H6 className='text-muted-foreground'>
                1,000 requests/hour
              </Typography.H6>
            </div>
          </div>
        </CardComponent>
      </div>
    </>
  );
};

export default ApiKey;
