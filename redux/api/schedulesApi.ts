import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Status } from '../../enums';
import { Schedule } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

type getSchedulesByLeagueIdAndDate = {
  date: string;
  id: string;
};

const schedulesApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    createSchedule: build.mutation({
      query: (schedule) => ({
        url: `api/schedules/league/${schedule.league}`,
        method: 'POST',
        body: schedule,
      }),
      invalidatesTags: ['Schedules'],
    }),
    schedules: build.query({
      query: () => '/schedules',
      providesTags: ['Schedules'],
    }),
    deleteScheduleByLeagueId: build.mutation({
      query: (id) => ({
        url: `api/schedules/league/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedules'],
    }),
    getSchedulesByLeagueId: build.query({
      query: (id) => `api/schedules/league/${id}`,
      providesTags: ['Schedules'],
    }),
    getSchedulesByLeagueIdAndDate: build.query({
      query: ({ date, id }) => `api/schedules/league/${id}/${date}`,
      providesTags: ['Schedules'],
    }),
    updateScheduleStatusByLeagueId: build.mutation({
      query: ({ id, payload }) => ({
        url: `api/schedules/league/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Schedules'],
    }),
  }),
  reducerPath: 'schedulesApi',
  tagTypes: ['Schedule', 'Schedules'],
});

export const {
  useCreateScheduleMutation,
  useDeleteScheduleByLeagueIdMutation,
  useGetSchedulesByLeagueIdQuery,
  useGetSchedulesByLeagueIdAndDateQuery,
  useSchedulesQuery,
  useUpdateScheduleStatusByLeagueIdMutation,
} = schedulesApi;

export default schedulesApi;
