import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Match } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST;

const matchesApi = createApi({
  reducerPath: 'matchesApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  tagTypes: ['Match'],
  endpoints: (build) => ({
    getMatchById: build.query<Match, string>({
      query: (id) => `/matches/${id}`,
      providesTags: ['Match'],
    }),
  }),
});

export const { useGetMatchByIdQuery } = matchesApi;

export default matchesApi;
