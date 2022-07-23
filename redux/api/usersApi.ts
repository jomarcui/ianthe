// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SignInInfo, User } from '../types/User';

// Define a service using a base URL and expected endpoints
const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  endpoints: (builder) => ({
    getUserByEmailAndPassword: builder.mutation<User, SignInInfo>({
      query: (signInInfo) => ({
        url: `users/auth`,
        method: 'POST',
        body: signInInfo,
      }),
    }),
  }),
});

export const { useGetUserByEmailAndPasswordMutation } = usersApi;

export default usersApi;
