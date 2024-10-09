import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import deviceReducer from './deviceSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    devices: deviceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
