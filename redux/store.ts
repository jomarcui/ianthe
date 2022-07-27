import { configureStore } from '@reduxjs/toolkit';
import teamsApi from './api/teamsApi';
import usersApi from './api/usersApi';
import schedulesSlice from './features/schedulesSlice';
import usersSlice from './features/usersSlice';

const store = configureStore({
  reducer: {
    schedules: schedulesSlice,
    users: usersSlice,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
});

export default store;
