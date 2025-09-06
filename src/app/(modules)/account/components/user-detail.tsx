import { IUser } from '@/app/auth/login/model-interfaces/interfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import { getInitials } from '@/global/utils/helper-fn';
import { cn } from '@/lib/utils';
import {
  Building2,
  Calendar,
  CreditCard,
  LogIn,
  Mail,
  Phone,
} from 'lucide-react';
import moment from 'moment';
import React from 'react';

type Props = {
  userData: IUser;
};

const UserDetail = ({ userData }: Props) => {
  return (
    <div className='grid lg:grid-cols-12 gap-4'>
      <CardComponent cardClass='lg:col-span-4 col-span-12 rounded-2xl'>
        <div className='flex flex-col items-center space-y-4 py-6'>
          <div className='relative'>
            <Avatar className='h-24 w-24 ring-4 ring-primary/20 shadow-md'>
              <AvatarImage
                src={userData.avatar_url || '/placeholder.svg'}
                alt={userData.full_name}
              />
              <AvatarFallback className='text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
                {getInitials(userData.full_name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <Typography.H3 className='text-center font-semibold'>
            {userData.full_name}
          </Typography.H3>

          <Badge
            variant='outline'
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium text-primary bg-primary/15'
            )}
          >
            {userData.role}
          </Badge>

          <div className='w-full space-y-3 border-2 border-dashed p-3 rounded-sm'>
            <div className='flex justify-between items-center px-6'>
              <Label className='text-muted-foreground'>Status</Label>
              <Badge
                variant={userData.is_active ? 'default' : 'destructive'}
                className='rounded-full'
              >
                {userData.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className='flex justify-between items-center px-6'>
              <Label className='text-muted-foreground'>Email Verified</Label>
              <Badge
                variant={userData.is_email_varified ? 'default' : 'destructive'}
                className='rounded-full'
              >
                {userData.is_email_varified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
        </div>
      </CardComponent>

      <CardComponent cardClass='lg:col-span-8 col-span-12'>
        <div className='space-y-8'>
          <Typography.H4>Contact Information</Typography.H4>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail className='h-4 w-4' />
                Email Address
              </div>
              <Typography.H5>{userData.email}</Typography.H5>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Phone className='h-4 w-4' />
                Phone
              </div>
              <Typography.H5>{userData.phone_number}</Typography.H5>
            </div>
          </div>

          {userData.organization_id && (
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Building2 className='h-4 w-4' />
                  Organization
                </div>
                <Typography.H5>{userData.organization.name}</Typography.H5>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <CreditCard className='h-4 w-4' />
                  Subscription
                </div>
                <Typography.H5>
                  {userData.organization?.subcription?.name}
                </Typography.H5>
              </div>
            </div>
          )}
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                Joined Date
              </div>
              <Typography.H5>
                {moment(userData.joined_at).format('lll')}
              </Typography.H5>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <LogIn className='h-4 w-4' />
                Last Login
              </div>
              <Typography.H5>
                {moment(userData.last_login_at).format('lll')}
              </Typography.H5>
            </div>
          </div>
        </div>
      </CardComponent>
    </div>
  );
};

export default UserDetail;
