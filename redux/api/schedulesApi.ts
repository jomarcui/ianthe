import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import build from 'next/dist/build';

const HOST = process.env.NEXT_PUBLIC_HOST;

type Schedule = {
  _id: string;
  date: Date;
  leagueId: string;
  sportId: string;
  teams: [];
};

const schedulesApi = createApi({
  reducerPath: 'schedulesApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    schedules: build.query<Schedule[], void>({
      query: () => '/schedules',
    }),
    addSchedule: build.mutation<Schedule, any>({
      query: (schedule) => ({
        url: `schedules/add`,
        method: 'POST',
        body: schedule,
      }),
    }),
  }),
});

export const { useAddScheduleMutation, useSchedulesQuery } = schedulesApi;

export default schedulesApi;
