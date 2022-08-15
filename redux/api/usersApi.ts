import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types';

const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'api' }),
  endpoints: (build) => ({
    createUser: build.mutation<User, User>({
      query: (payload) => ({
        url: '/users',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useCreateUserMutation } = usersApi;

export default usersApi;
