import { vouchifyApi } from '@/global/utils/api';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';
import { IEmailTemplatePost } from '../model-interfaces/interfaces';

export const getAllEmailTemplatesService = async (queryString?: string) => {
  try {
    const res = await vouchifyApi.request(
      `/email-templates/list?${queryString ?? ''}`,
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
  tempData: Partial<IEmailTemplatePost>
) => {
  try {
    const res = await vouchifyApi.request<Partial<IEmailTemplatePost>>(
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

export const createEmailTemplatesService = async (
  tempData: IEmailTemplatePost
) => {
  try {
    const res = await vouchifyApi.request<IEmailTemplatePost>(
      `/email-templates`,
      {
        method: 'POST',
        data: tempData,
      }
    );
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};

export const deleteEmailTemplatesService = async (tempId: string) => {
  try {
    const res = await vouchifyApi.request(`/email-templates/${tempId}`, {
      method: 'DELETE',
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};
