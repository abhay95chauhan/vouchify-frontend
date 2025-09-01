import { vouchifyApi } from '@/global/utils/api';
import {
  EmailTemplate,
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

// email templates

export const getAllEmailTemplatesService = async (queryString?: string) => {
  try {
    const res = await vouchifyApi.request<EmailTemplate>(
      `/email-templates/list?${queryString}`,
      {
        method: 'GET',
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};

export const updateEmailTemplatesService = async (
  tempId: string,
  tempData: Partial<EmailTemplate>
) => {
  try {
    const res = await vouchifyApi.request<Partial<EmailTemplate>>(
      `/email-templates/${tempId}`,
      {
        method: 'PATCH',
        data: tempData,
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};
