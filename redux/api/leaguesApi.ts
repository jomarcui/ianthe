import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { League } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

const leaguesApi = createApi({
  reducerPath: 'leaguesApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    getLeagues: build.query<any, void>({
      query: () => 'api/leagues',
    }),
  }),
});

export const { useGetLeaguesQuery } = leaguesApi;

export default leaguesApi;
