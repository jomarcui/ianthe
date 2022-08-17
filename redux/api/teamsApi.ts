import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team } from '../../types';

type TeamsApiResponse = {
  success: boolean;
  data: Team | (Team[] & { name: String });
};

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    getTeamById: build.query<TeamsApiResponse, any>({
      query: (id) => `api/teams/${id}`
    }),
    getTeams: build.query<TeamsApiResponse, void>({
      query: () => 'api/teams',
    }),
  }),
});

export const { useGetTeamByIdQuery, useGetTeamsQuery } = teamsApi;

export default teamsApi;
