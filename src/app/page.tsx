import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMeUserAction } from './auth/login/actions/actions';
import OrganizationCreate from './(modules)/[organization-slug]/views/organization-create';

export default async function Home() {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) {
    redirect('/auth/login');
  }

  const res = await getMeUserAction(jwt);

  if (res?.code === 200 && res?.data?.organization_id) {
    redirect('/dashboard');
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
