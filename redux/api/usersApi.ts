// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SignInInfo, User } from '../types/User';

const HOST = process.env.NEXT_PUBLIC_HOST;

// Define a service using a base URL and expected endpoints
const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    getUserByEmailAndPassword: build.mutation<User, SignInInfo>({
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
