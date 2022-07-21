import { Box } from '@mui/material';
import Image from 'next/image';
import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

const Home = () => (
  <Layout>
    {/* <Dashboard /> */}
    <Box sx={{ my: 2 }}>
      <Image src="/ianthe.png" alt="ianthe" width="100" height="100" />
    </Box>
  </Layout>
);

export default Home;
