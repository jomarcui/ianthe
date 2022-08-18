import { NextPage } from 'next';
import { Box } from '@mui/material';
import { wrapper } from '../../redux/store';
import { User } from '../../types';
import ComponentsLayout from '../../components/Layout';
import ContainersCredits from '../../containers/Credits';
import usersApi, { useGetUsersQuery } from '../../redux/api/usersApi';
import Loader from '../../components/Loader';

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (context) => {
//     store.dispatch(usersApi.endpoints.getUsers.initiate());
//     await Promise.all(usersApi.util.getRunningOperationPromises());

//     return {
//       props: {},
//     };
//   }
// );

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (context) => {
    store.dispatch(usersApi.endpoints.getUsers.initiate());

    await Promise.all(usersApi.util.getRunningOperationPromises());

    return {
      props: {},
    };
  }
);

type CreditsProps = {
  users: User[];
};

const Credits: NextPage = () => {
  const { data: getUsersResponse, isLoading: isGetUsersLoading } =
    useGetUsersQuery();

  console.log('getUsersResponse', getUsersResponse);

  return (
    <ComponentsLayout>
      {isGetUsersLoading && <Loader />}

      {getUsersResponse && <ContainersCredits users={getUsersResponse.data} />}
    </ComponentsLayout>
  );
};

export default Credits;
