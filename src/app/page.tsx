import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMeUserService } from './auth/login/actions-services/services';
import OrganizationCreate from './(modules)/[organization-slug]/views/organization-create';

export default async function Home() {
  const jwt = (await cookies()).get('jwt')?.value;
  if (!jwt) redirect('/auth/login');

  const res = await getMeUserService(jwt);
  const user = res?.data;

  // Invalid or expired token → login
  if (res?.error?.code === 401) {
    return redirect('/auth/login');
  }

  // Email not verified → verify email page
  if (!user?.is_email_varified) {
    return redirect(`/verify-email?token=${jwt}`);
  }

  // User already has org → dashboard
  if (user?.organization_id) {
    return redirect('/dashboard');
  }

  return <OrganizationCreate />;
}
