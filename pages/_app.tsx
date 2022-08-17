import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import Head from 'next/head';
import store from '../redux/store';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '../styles/globals.css';

const MyApp: NextPage = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  <>
    <Head>
      <title>Ianthe</title>
    </Head>
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>
    </SessionProvider>
  </>
);

export default MyApp;
