import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@/app/auth/login/reducers/reducers';
import organizationSlice from '@/app/(modules)/[organization-slug]/reducers/reducers';
import emailTemplatesSlice from '@/app/(modules)/email-templates/reducers/reducers';
import commonSlice from './common-reducers';

export const makeStore = () => {
  return configureStore({
    reducer: {
      common: commonSlice,
      user: userSlice,
      organization: organizationSlice,
      emailTemplates: emailTemplatesSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
