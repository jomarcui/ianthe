import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { wrapper } from '../redux/store';
import Head from 'next/head';
import type { AppProps } from 'next/app';

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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Ianthe</title>
    </Head>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </>
);

export default wrapper.withRedux(MyApp);
