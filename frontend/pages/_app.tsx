import type { AppProps } from 'next/app';
import Head from 'next/head';
import RouteGuard from '../containers/RouteGuard';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Ianthe</title>
      </Head>
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </>
  );
};

export default MyApp;
