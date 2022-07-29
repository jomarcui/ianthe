import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Sport } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST;

const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    sports: build.query<Sport[], void>({
      query: () => '/sports',
    }),
  }),
});

export const { useSportsQuery } = sportsApi;

export default sportsApi;
