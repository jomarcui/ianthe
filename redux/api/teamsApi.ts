import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST;

const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    teams: build.query<Team[], void>({
      query: () => '/teams',
    }),
  }),
});

export const { useTeamsQuery } = teamsApi;

export default teamsApi;
