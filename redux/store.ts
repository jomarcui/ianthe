import { configureStore } from '@reduxjs/toolkit';
import leaguesApi from './api/leaguesApi';
import schedulesApi from './api/schedulesApi';
import sportsApi from './api/sportsApi';
import teamsApi from './api/teamsApi';
import usersApi from './api/usersApi';
import schedulesSlice from './features/schedulesSlice';
import usersSlice from './features/usersSlice';

const store = configureStore({
  reducer: {
    schedules: schedulesSlice,
    users: usersSlice,
    [leaguesApi.reducerPath]: leaguesApi.reducer,
    [schedulesApi.reducerPath]: schedulesApi.reducer,
    [sportsApi.reducerPath]: sportsApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      leaguesApi.middleware,
      schedulesApi.middleware,
      teamsApi.middleware,
    ]),
});

export default store;
