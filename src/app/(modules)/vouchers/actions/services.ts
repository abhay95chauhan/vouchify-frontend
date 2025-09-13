import { vouchifyApi } from '@/global/utils/api';
import {
  IValidateVoucherPost,
  IVoucherPost,
} from '../interface-model/interfaces';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';

export const createVoucherService = async (voucherData: IVoucherPost) => {
  try {
    const res = await vouchifyApi.request<IVoucherPost>('/voucher', {
      method: 'POST',
      data: voucherData,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const getVoucherByCodeService = async (code: string, jwt?: string) => {
  try {
    const res = await vouchifyApi.request(`/voucher/${code}`, {
      method: 'GET',
      jwt,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const deleteVoucherByCodeService = async (code: string) => {
  try {
    const res = await vouchifyApi.request(`/voucher/${code}`, {
      method: 'DELETE',
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const updateVoucherService = async (
  voucherData: Partial<IVoucherPost>,
  code: string
) => {
  try {
    const res = await vouchifyApi.request<Partial<IVoucherPost>>(
      `/voucher/${code}`,
      {
        method: 'PATCH',
        data: voucherData,
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const validateVoucherService = async (
  voucherValidateData: IValidateVoucherPost
) => {
  try {
    const res = await vouchifyApi.request<IValidateVoucherPost>(
      '/voucher/validate',
      {
        method: 'POST',
        data: voucherValidateData,
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const sendVoucherViaEmailService = async (mailData: {
  code: string;
  email: string | string[];
}) => {
  try {
    const res = await vouchifyApi.request('/voucher/send-mail', {
      method: 'POST',
      data: mailData,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};
