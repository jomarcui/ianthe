import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

const HOST = process.env.NEXT_PUBLIC_HOST_V2;

const transactionsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: HOST }),
  endpoints: (build) => ({
    createTransaction: build.mutation<any, any>({
      query: (payload) => ({
        body: payload,
        method: 'POST',
        url: 'api/transactions',
      }),
      invalidatesTags: ['Transaction', 'Transactions'],
    }),
    getTransactionById: build.query<any, string>({
      query: (id) => `api/transactions/${id}`,
      providesTags: ['Transaction'],
    }),
    getTransactions: build.query<any, void>({
      query: () => 'api/transactions',
      providesTags: ['Transactions'],
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  reducerPath: 'transactionsApi',
  tagTypes: ['Transaction', 'Transactions'],
});

export const {
  useCreateTransactionMutation,
  useGetTransactionByIdQuery,
  useGetTransactionsQuery,
} = transactionsApi;
export const { getTransactions } = transactionsApi.endpoints;

export default transactionsApi;
