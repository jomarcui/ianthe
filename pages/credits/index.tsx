import { NextPage } from 'next';
import { Box } from '@mui/material';
import { wrapper } from '../../redux/store';
import ComponentsLayout from '../../components/Layout';
import ContainersCredits from '../../containers/Credits';
import usersApi, { useGetUsersQuery } from '../../redux/api/usersApi';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=1800, stale-while-revalidate=86400'
    );

    store.dispatch(usersApi.endpoints.getUsers.initiate());
    await Promise.all(usersApi.util.getRunningOperationPromises());

    return {
      props: {},
    };
  }
);

const Credits: NextPage = () => {
  const { data: getUsersResponse } = useGetUsersQuery();
  const { data: users } = getUsersResponse;

  return (
    <ComponentsLayout>
      <ContainersCredits users={users} />
    </ComponentsLayout>
  );
};

export default Credits;
