import { vouchifyApi } from '@/global/utils/api';
import { IVoucherPost } from '../interface-model/interfaces';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';

export const createVoucherAction = async (voucherData: IVoucherPost) => {
  try {
    const res = await vouchifyApi.request<IVoucherPost>('/voucher', {
      method: 'POST',
      data: voucherData,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};
