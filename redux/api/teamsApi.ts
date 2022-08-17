import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team } from '../../types';

type TeamsApiResponse = {
  success: boolean;
  data: Team[];
};

const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'api' }),
  endpoints: (build) => ({
    getTeams: build.query<TeamsApiResponse, void>({
      query: () => '/teams',
    }),
  }),
});

export const { useGetTeamsQuery } = teamsApi;

export default teamsApi;
