import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number;
  email: string;
  fullname: string;
  accessToken: string | null;
}

const initialState: UserState = {
  id: 1,
  email: '',
  fullname: '',
  accessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.fullname = action.payload.fullname;
      state.accessToken = action.payload.accessToken;
    },
    clearUser(state) {
      state.id = 1;
      state.email = '';
      state.fullname = '';
      state.accessToken = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
