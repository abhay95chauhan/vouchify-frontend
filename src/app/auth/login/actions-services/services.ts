import { vouchifyApi } from '@/global/utils/api';
import { ILogin, IUser } from '../model-interfaces/interfaces';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';

export const logoutService = async () => {
  try {
    await vouchifyApi.request('/user/logout', {
      method: 'POST',
    });
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const loginService = async (loginData: ILogin) => {
  try {
    const res = await vouchifyApi.request<ILogin>('/user/login', {
      method: 'POST',
      data: loginData,
    });
    return res;
  } catch (error: unknown) {
    const { message } = handleError(error);
    toast?.error(message);
  }
};

export const getMeUserService = async (token: string) => {
  try {
    const res = await vouchifyApi.request<IUser>('/user/me', {
      method: 'GET',
      jwt: token,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast?.error(message);
    throw error;
  }
};
