import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { League } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST;

const leaguesApi = createApi({
  reducerPath: 'leaguesApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    leagues: build.query<League[], void>({
      query: () => '/leagues',
    }),
  }),
});

export const { useLeaguesQuery } = leaguesApi;

export default leaguesApi;
