import { NextPage } from 'next';
import ComponentsLayout from '../../components/Layout';
import ContainersUsersList from '../../containers/Users/List';

const Users: NextPage = () => {
  return (
    <ComponentsLayout>
      <ContainersUsersList />
    </ComponentsLayout>
  );
};

export default Users;
