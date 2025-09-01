import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrganizationGet } from '../model-interface/interfaces';
import { OrganizationModelGet } from '../model-interface/model';

interface State {
  organization: IOrganizationGet;
}

const initialState: State = {
  organization: new OrganizationModelGet(),
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizationById(state, action: PayloadAction<IOrganizationGet>) {
      state.organization = action.payload;
    },
  },
});

export const { setOrganizationById } = organizationSlice.actions;
export default organizationSlice.reducer;
