import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const Match: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <Layout>{id}</Layout>;
};

export default Match;
