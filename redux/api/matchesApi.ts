import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

const matchesApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    createMatch: build.mutation({
      query: (payload) => ({
        url: `api/matches/league/${payload.league}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Matches'],
    }),
    matches: build.query({
      query: () => '/matches',
      providesTags: ['Matches'],
    }),
    deleteMatchByLeagueId: build.mutation({
      query: (id) => ({
        url: `api/matches/league/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Matches'],
    }),
    getMatchById: build.query({
      query: (id) => `api/matches/${id}`,
      providesTags: ['Match'],
    }),
    getMatchTransactionsByUserId: build.query({
      query: ({ id, userId }) => `api/matches/${id}/${userId}`,
      providesTags: ['Match'],
    }),
    getMatchesByLeagueId: build.query({
      query: (id) => `api/matches/league/${id}`,
      providesTags: ['Matches'],
    }),
    getMatchesByLeagueIdAndDate: build.query({
      query: ({ date, id }) => `api/matches/league/${id}/${date}`,
      providesTags: ['Matches'],
    }),
    updateMatchestatusByLeagueId: build.mutation({
      query: ({ id, payload }) => ({
        url: `api/matches/league/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Matches'],
    }),
  }),
  reducerPath: 'matchesApi',
  tagTypes: ['Match', 'Matches'],
});

export const {
  useCreateMatchMutation,
  useDeleteMatchByLeagueIdMutation,
  useGetMatchByIdQuery,
  useGetMatchTransactionsByUserIdQuery,
  useGetMatchesByLeagueIdQuery,
  useGetMatchesByLeagueIdAndDateQuery,
  useMatchesQuery,
  useUpdateMatchestatusByLeagueIdMutation,
} = matchesApi;

export default matchesApi;
