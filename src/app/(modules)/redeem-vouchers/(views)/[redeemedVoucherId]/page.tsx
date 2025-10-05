import React from 'react';
import { VoucherRedemptionDetailComponent } from '../../components/redeemed-voucher-detail-component';
import { getRedeemedVoucherByIdService } from '../../actions/services';
import { cookies } from 'next/headers';
import VoucherNotFound from '@/app/(modules)/vouchers/components/not-found';

const VoucherRedeemedDetail = async ({
  params,
}: {
  params: Promise<{ redeemedVoucherId: string }>;
}) => {
  const jwt = (await cookies()).get('jwt')?.value;
  const { redeemedVoucherId } = await params;

  const res = await getRedeemedVoucherByIdService(
    redeemedVoucherId,
    jwt as string
  );

  if (res?.error?.code === 404) {
    return <VoucherNotFound />;
  }
  return (
    <>
      <VoucherRedemptionDetailComponent redemption={res.data} />
    </>
  );
};

export default VoucherRedeemedDetail;
