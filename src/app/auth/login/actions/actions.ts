import { vouchifyApi } from '@/global/utils/api';
import { ILogin, IUser } from '../model-interfaces/interfaces';
import { toast } from 'sonner';
import { handleError } from '@/global/utils/error-handler';

export const logout = async () => {
  try {
    await vouchifyApi.request('/user/logout', {
      method: 'POST',
    });
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};

export const loginAction = async (loginData: ILogin) => {
  try {
    const res = await vouchifyApi.request<ILogin>('/user/login', {
      method: 'POST',
      data: loginData,
    });
    return res;
  } catch (error: unknown) {
    const { message } = handleError(error);
    toast.error(message);
  }
};

export const getMeUserAction = async (token: string) => {
  try {
    const res = await vouchifyApi.request<IUser>('/user/me', {
      method: 'GET',
      jwt: token,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};
