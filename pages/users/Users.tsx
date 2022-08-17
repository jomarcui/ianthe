import { NextPage } from 'next';
import ComponentsLayout from '../../components/Layout';
import ContainersUsersForm from '../../containers/Users/Form';

const Users: NextPage = () => {
  return (
    <ComponentsLayout>
      <ContainersUsersForm />
    </ComponentsLayout>
  );
};

export default Users;
