import { getVoucherByCodeService } from '../../actions/services';
import { cookies } from 'next/headers';
import VoucherCreate from '../create/page';
import VoucherNotFound from '../../components/not-found';

export default async function VoucherEdit({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const jwt = (await cookies()).get('jwt')?.value;
  const { code } = await params;

  const res = await getVoucherByCodeService(code, jwt as string);

  if (res?.error?.code === 404) {
    return <VoucherNotFound />;
  }

  return <VoucherCreate voucherData={res?.data} />;
}
