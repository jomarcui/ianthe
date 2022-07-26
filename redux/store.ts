import { configureStore } from '@reduxjs/toolkit';
import usersApi from './api/usersApi';
import schedulesSlice from './features/schedulesSlice';
import usersSlice from './features/users/usersSlice';

const store = configureStore({
  reducer: {
    schedules: schedulesSlice,
    users: usersSlice,
    [usersApi.reducerPath]: usersApi.reducer,
  },
});

export default store;
