import { Dispatch } from '@reduxjs/toolkit';
import { getAllEmailTemplatesService } from './services';
import { setEmailTemplates } from '../reducers/reducers';

export const getAllEmailTemplatesAction =
  (queryString?: string) => async (dispatch: Dispatch) => {
    const res = await getAllEmailTemplatesService(queryString);
    dispatch(setEmailTemplates(res?.data));
  };
