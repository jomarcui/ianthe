import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const HOST = process.env.NEXT_PUBLIC_HOST;

type Schedule = {
  _id: string;
  date: Date;
  leagueId: string;
  sportId: string;
  teams: {
    home: string;
    visitor: string;
  };
};

const schedulesApi = createApi({
  reducerPath: 'schedulesApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  tagTypes: ['Schedule'],
  endpoints: (build) => ({
    schedules: build.query<Schedule[], void>({
      query: () => '/schedules',
      providesTags: ['Schedule'],
    }),
    addSchedule: build.mutation<Schedule, any>({
      query: (schedule) => ({
        url: 'schedules/add',
        method: 'POST',
        body: schedule,
      }),
      invalidatesTags: ['Schedule'],
    }),
    deleteSchedule: build.mutation<Schedule, any>({
      query: (id) => ({
        url: `schedules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const {
  useAddScheduleMutation,
  useDeleteScheduleMutation,
  useSchedulesQuery,
} = schedulesApi;

export default schedulesApi;
