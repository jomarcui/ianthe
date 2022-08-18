import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { User } from '../../types';

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

type GetUsersResponse = {
  success: boolean;
  data: User[];
};

const usersApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => ({
    createUser: build.mutation<User, User>({
      query: (payload) => ({
        url: 'api/users',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    getUsers: build.query<GetUsersResponse, void>({
      query: () => 'api/users',
      providesTags: ['Users'],
    }),
  }),
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
});

export const { useCreateUserMutation, useGetUsersQuery } = usersApi;

// export endpoints for use in SSR
export const { getUsers } = usersApi.endpoints;

export default usersApi;
