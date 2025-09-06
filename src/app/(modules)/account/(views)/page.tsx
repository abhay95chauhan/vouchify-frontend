import React from 'react';
import UserDetail from '../components/user-detail';
import { cookies } from 'next/headers';
import { getMeUserService } from '@/app/auth/login/actions-services/services';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/global/components/page-header/page-header';

const AccountPage = async () => {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) {
    redirect('/auth/login');
  }

  const res = await getMeUserService(jwt);
  return (
    <div className='space-y-4'>
      <PageHeader
        showBackButton
        backRedirectUrl='/dashboard'
        title={'Personal Details'}
        description='Securely manage your account information'
      />

      <UserDetail userData={res?.data} />
    </div>
  );
};

export default AccountPage;
