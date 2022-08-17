import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team } from '../../types';

type GetTeamByIdResponse = {
  success: boolean;
  data: Team;
}

type GetTeamsResponse = {
  success: boolean;
  data: Team[];
};

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    getTeamById: build.query<GetTeamByIdResponse, any>({
      query: (id) => `api/teams/${id}`
    }),
    getTeams: build.query<GetTeamsResponse, void>({
      query: () => 'api/teams',
    }),
  }),
});

export const { useGetTeamByIdQuery, useGetTeamsQuery } = teamsApi;

export default teamsApi;
