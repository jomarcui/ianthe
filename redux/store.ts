import { configureStore } from '@reduxjs/toolkit';
import usersApi from './api/usersApi';
import usersSlice from './features/users/usersSlice';

const store = configureStore({
  reducer: {
    users: usersSlice,
    [usersApi.reducerPath]: usersApi.reducer,
  },
});

export default store;
