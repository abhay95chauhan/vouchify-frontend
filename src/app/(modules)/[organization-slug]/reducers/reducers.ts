import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmailTemplate, IOrganizationGet } from '../model-interface/interfaces';
import { OrganizationModelGet } from '../model-interface/model';

interface State {
  organization: IOrganizationGet;
  emailTemplates: EmailTemplate[];
}

const initialState: State = {
  organization: new OrganizationModelGet(),
  emailTemplates: [],
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizationById(state, action: PayloadAction<IOrganizationGet>) {
      state.organization = action.payload;
    },
    setEmailTemplates(state, action: PayloadAction<EmailTemplate[]>) {
      state.emailTemplates = action.payload;
    },
  },
});

export const { setOrganizationById, setEmailTemplates } =
  organizationSlice.actions;
export default organizationSlice.reducer;
