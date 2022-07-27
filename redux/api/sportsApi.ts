import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const HOST = process.env.NEXT_PUBLIC_HOST;

// type Team = {
//   _id: string;
//   league_id: number;
//   name: string;
//   sport_id: number;
//   createdAt: Date;
//   updatedAt: Date;
// };

const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (builder) => ({
    sports: builder.query<unknown[], void>({
      query: () => '/sports',
    }),
  }),
});

export const { useSportsQuery } = sportsApi;

export default sportsApi;
