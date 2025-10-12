import { IApi } from '@/global/interfaces/interfaces';
import { vouchifyApi } from '@/global/utils/api';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';
import { IDashboardGet } from '../model-interfaces/interfaces';

export const getDashboardDataService = async (): Promise<
  IApi<IDashboardGet>
> => {
  try {
    const res = await vouchifyApi.request(`/dashboard`, {
      method: 'GET',
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);

    // Return a default/fallback object so TypeScript is happy
    return {
      code: 500,
      status: 'error',
      message,
      data: {} as IDashboardGet,
    };
  }
};
