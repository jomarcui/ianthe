import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const HOST = process.env.NEXT_PUBLIC_HOST;

type Leagues = {
  _id: string;
  name: string;
  initialism: string;
  sportsId: string;
};

const leaguesApi = createApi({
  reducerPath: 'leaguesApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (builder) => ({
    leagues: builder.query<Leagues[], void>({
      query: () => '/leagues',
    }),
  }),
});

export const { useLeaguesQuery } = leaguesApi;

export default leaguesApi;
