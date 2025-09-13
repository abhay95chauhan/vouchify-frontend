import { vouchifyApi } from '@/global/utils/api';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';
import { IUserSessionGet } from '../model-interfaces/interfaces';

export const getAllUserSessionsService = async (token: string) => {
  try {
    const res = await vouchifyApi.request(`/user-sessions/list`, {
      method: 'GET',
      jwt: token,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const updateUserSessionsService = async (
  id: string,
  sessionData: Partial<IUserSessionGet>
) => {
  try {
    const res = await vouchifyApi.request<Partial<IUserSessionGet>>(
      `/user-sessions/${id}`,
      {
        method: 'PATCH',
        data: sessionData,
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const deleteUserSessionsService = async (id: string) => {
  try {
    const res = await vouchifyApi.request(`/user-sessions/${id}`, {
      method: 'DELETE',
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};
