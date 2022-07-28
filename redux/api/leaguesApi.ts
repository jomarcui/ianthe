import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const HOST = process.env.NEXT_PUBLIC_HOST;

type League = {
  _id: string;
  name: string;
  initialism: string;
  sportsId: string;
};

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
