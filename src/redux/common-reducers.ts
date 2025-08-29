import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CommonState {
  hardRefresh: boolean;
}

const initialState: CommonState = {
  hardRefresh: false,
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setHardRefresh: (state, action: PayloadAction<boolean>) => {
      state.hardRefresh = action.payload;
    },
  },
});

export const { setHardRefresh } = commonSlice.actions;

export default commonSlice.reducer;
