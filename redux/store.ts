import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import leaguesApi from './api/leaguesApi';
import matchesApi from './api/matchesApi';
import schedulesApi from './api/schedulesApi';
import sportsApi from './api/sportsApi';
import teamsApi from './api/teamsApi';
import transactionsApi from './api/transactionsApi';
import usersApi from './api/usersApi';
import schedulesSlice from './features/schedulesSlice';
import usersSlice from './features/usersSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      schedules: schedulesSlice,
      users: usersSlice,
      [leaguesApi.reducerPath]: leaguesApi.reducer,
      [matchesApi.reducerPath]: matchesApi.reducer,
      [schedulesApi.reducerPath]: schedulesApi.reducer,
      [sportsApi.reducerPath]: sportsApi.reducer,
      [teamsApi.reducerPath]: teamsApi.reducer,
      [transactionsApi.reducerPath]: transactionsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([
        leaguesApi.middleware,
        matchesApi.middleware,
        schedulesApi.middleware,
        teamsApi.middleware,
        transactionsApi.middleware,
        usersApi.middleware,
      ]),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
