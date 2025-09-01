import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmailTemplate } from '../model-interfaces/interfaces';

interface State {
  emailTemplates: IEmailTemplate[];
}

const initialState: State = {
  emailTemplates: [],
};

const emailTemplatesSlice = createSlice({
  name: 'emailTemplatesSlice',
  initialState,
  reducers: {
    setEmailTemplates(state, action: PayloadAction<IEmailTemplate[]>) {
      state.emailTemplates = action.payload;
    },
  },
});

export const { setEmailTemplates } = emailTemplatesSlice.actions;
export default emailTemplatesSlice.reducer;
