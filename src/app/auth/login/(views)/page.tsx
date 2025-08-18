import React from 'react';
import LoginForm from '../views/login-form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async () => {
  const jwt = (await cookies()).get('jwt')?.value;

  if (jwt) {
    redirect('/');
  }
  return (
    <>
      <LoginForm />
    </>
  );
};

export default page;
