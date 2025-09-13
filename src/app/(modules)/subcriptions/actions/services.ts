import { vouchifyApi } from '@/global/utils/api';
import { ISubscriptionGet } from '../model-interfaces/interfaces';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';

export const getAllSubcriptionsService = async () => {
  try {
    const res = await vouchifyApi.request<ISubscriptionGet[]>(
      '/subcriptions/list',
      {
        method: 'GET',
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};
