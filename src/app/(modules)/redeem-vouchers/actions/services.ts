import { vouchifyApi } from '@/global/utils/api';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';

export const getRedeemedVoucherByIdService = async (
  id: string,
  jwt?: string
) => {
  try {
    const res = await vouchifyApi.request(`/voucher-redeem/${id}`, {
      method: 'GET',
      jwt,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};
