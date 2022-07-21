import Head from 'next/head';
import Layout from '../components/Layout/Layout';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Ianthe</title>
        <meta name="description" content="A sample project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>Main</main>
      </Layout>
    </div>
  );
};

export default Home;
