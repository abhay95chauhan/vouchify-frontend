import React from 'react';
import UserDetail from '../components/user-detail';
import { cookies } from 'next/headers';
import { getMeUserService } from '@/app/auth/login/actions-services/services';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/global/components/page-header/page-header';
import UserSessions from '../components/user-sessions';
import { getAllUserSessionsService } from '../actions/services';

const AccountPage = async () => {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) {
    redirect('/auth/login');
  }

  const res = await getMeUserService(jwt);
  const allSessions = await getAllUserSessionsService(jwt);
  return (
    <div className='space-y-4'>
      <PageHeader
        showBackButton
        backRedirectUrl='/dashboard'
        title={'Personal Details'}
        description='Securely manage your account information'
      />

      <UserDetail userData={res?.data} />
      <UserSessions sessions={allSessions?.data} token={jwt} />
    </div>
  );
};

export default AccountPage;
