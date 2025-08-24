import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMeUserService } from './auth/login/actions-services/services';
import OrganizationCreate from './(modules)/[organization-slug]/views/organization-create';

export default async function Home() {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) {
    redirect('/auth/login');
  }

  const res = await getMeUserService(jwt);

  if (res?.code === 200 && res?.data?.organization_id) {
    if (!res?.data?.is_email_varified) {
      redirect(`/verify-email?token=${jwt}`);
    } else {
      redirect('/dashboard');
    }
  } else {
    if (res?.code !== 200) {
      redirect('/auth/login');
    }
  }

  return (
    <>
      <OrganizationCreate />
    </>
  );
}
