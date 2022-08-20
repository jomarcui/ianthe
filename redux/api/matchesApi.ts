import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Match } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

const matchesApi = createApi({
  reducerPath: 'matchesApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  tagTypes: ['Match'],
  endpoints: (build) => ({
    getMatchById: build.query({
      query: (id) => `api/matches/${id}`,
      providesTags: ['Match'],
    }),
  }),
});

export const { useGetMatchByIdQuery } = matchesApi;

export default matchesApi;
