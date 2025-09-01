import { Dispatch } from '@reduxjs/toolkit';
import { getAllEmailTemplatesService } from './services';
import { setEmailTemplates } from '../reducers/reducers';

export const getAllEmailTemplatesAction = () => async (dispatch: Dispatch) => {
  const res = await getAllEmailTemplatesService();
  dispatch(setEmailTemplates(res?.data));
};
