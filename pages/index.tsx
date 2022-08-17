import { NextPage } from 'next';
import ComponentsLayout from '../components/Layout';
import ContainersHome from '../containers/Home';

const Home: NextPage = () => (
  <ComponentsLayout>
    <ContainersHome />
  </ComponentsLayout>
);

export default Home;
