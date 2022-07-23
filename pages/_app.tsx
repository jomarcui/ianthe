import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import RouteGuard from '../containers/RouteGuard';
import store from '../redux/store';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Ianthe</title>
      </Head>
      <Provider store={store}>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </Provider>
    </>
  );
};

export default MyApp;
