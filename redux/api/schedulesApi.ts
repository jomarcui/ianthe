import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Status } from '../../enums';
import { Schedule } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST;

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
    updateScheduleStatus: build.mutation<Schedule, any>({
      query: ({ id, status }: { id: string; status: Status }) => ({
        url: `schedules/update/status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const {
  useAddScheduleMutation,
  useDeleteScheduleMutation,
  useSchedulesQuery,
  useUpdateScheduleStatusMutation,
} = schedulesApi;

export default schedulesApi;
