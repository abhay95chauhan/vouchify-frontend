import { vouchifyApi } from '@/global/utils/api';
import {
  IGenericRes,
  IOrganizationGet,
  IOrganizationPost,
} from '../model-interface/interfaces';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';

export const createOrganizationService = async (orgData: IOrganizationPost) => {
  try {
    const res = await vouchifyApi.request<IOrganizationPost>('/organization', {
      method: 'POST',
      data: orgData,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};

export const updateMyOrganizationService = async (
  orgData: Partial<IOrganizationPost>
): Promise<IGenericRes<IOrganizationGet>> => {
  try {
    const res = await vouchifyApi.request<Partial<IOrganizationPost>>(
      `/organization`,
      {
        method: 'PATCH',
        data: orgData,
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
    throw error;
  }
};

export const getMyOrganizationService = async (
  jwt?: string
): Promise<IGenericRes<IOrganizationGet>> => {
  try {
    const res = await vouchifyApi.request<IOrganizationGet>(`/organization`, {
      method: 'GET',
      jwt,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
    throw error; // important: preserve type consistency
  }
};
