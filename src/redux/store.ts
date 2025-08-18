import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@/app/auth/login/reducers/reducers';
import organizationSlice from '@/app/(modules)/[organization-slug]/reducers/reducers';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      organization: organizationSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
