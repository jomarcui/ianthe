import { Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

const Home = () => (
  <Layout>
    <Dashboard />
    <Link href="/signin">
      <a>Sign-out</a>
    </Link>
  </Layout>
);

export default Home;
