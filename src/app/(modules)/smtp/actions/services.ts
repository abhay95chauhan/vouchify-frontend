import { vouchifyApi } from '@/global/utils/api';
import { IGenericRes } from '../../[organization-slug]/model-interface/interfaces';
import { ISmtpGet, ISmtpPost } from '../model-interfaces/interfaces';
import { handleError } from '@/global/utils/error-handler';
import { toast } from 'sonner';

export const getMySmtpService = async (
  jwt?: string
): Promise<IGenericRes<ISmtpGet>> => {
  try {
    const res = await vouchifyApi.request<ISmtpGet>(`/smtp`, {
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

export const createOrganizationSmtp = async (smtpData: ISmtpPost) => {
  try {
    const res = await vouchifyApi.request<ISmtpPost>('/smtp', {
      method: 'POST',
      data: smtpData,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};

export const sendEmailTemplateMailService = async (mailData: {
  templateId: string;
  email: string;
}) => {
  try {
    const res = await vouchifyApi.request(`/smtp/send-mail`, {
      method: 'POST',
      data: mailData,
    });
    return res;
  } catch (error) {
    const { message } = handleError(error);
    toast.error(message);
  }
};
