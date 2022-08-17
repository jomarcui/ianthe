import { NextPage } from 'next';
import ComponentsLayout from '../../components/Layout';
import ContainersUsersList from '../../containers/Users/List';
// import ContainersUsersForm from '../../containers/Users/Form';

const Users: NextPage = () => {
  return (
    <ComponentsLayout>
      <ContainersUsersList />
      {/* <ContainersUsersForm /> */}
    </ComponentsLayout>
  );
};

export default Users;
