import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../model-interfaces/interfaces';
import { UserModelGet } from '../model-interfaces/model';

interface State {
  user: IUser;
}

const initialState: State = {
  user: new UserModelGet(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
