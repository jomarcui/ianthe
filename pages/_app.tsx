import type { AppProps } from 'next/app';
import Head from 'next/head';
import RouteGuard from '../containers/RouteGuard';
import UserContext from '../contexts/UserContext';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Ianthe</title>
      </Head>
      <UserContext>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </UserContext>
    </>
  );
};

export default MyApp;
