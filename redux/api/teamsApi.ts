import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const HOST = process.env.NEXT_PUBLIC_HOST;

type Team = {
  _id: string;
  league_id: number;
  name: string;
  sport_id: number;
  createdAt: Date;
  updatedAt: Date;
};

const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (builder) => ({
    teams: builder.query<Team[], void>({
      query: () => '/teams',
    }),
  }),
});

export const { useTeamsQuery } = teamsApi;

export default teamsApi;
