import { NextPage } from 'next';
import { wrapper } from '../../redux/store';
import ComponentsLayout from '../../components/Layout';
import ContainersCredits from '../../containers/Credits';
import Loader from '../../components/Loader';
import transactionsApi, {
  useGetTransactionsQuery,
} from '../../redux/api/transactionsApi';

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
    store.dispatch(transactionsApi.endpoints.getTransactions.initiate());

    await Promise.all(transactionsApi.util.getRunningOperationPromises());

    return {
      props: {},
    };
  }
);

const Credits: NextPage = () => {
  const { data: getTransactionsResponse, isLoading: isGetTransactionsLoading } =
    useGetTransactionsQuery();

  return (
    <ComponentsLayout>
      {isGetTransactionsLoading && <Loader />}

      {getTransactionsResponse && (
        <ContainersCredits users={getTransactionsResponse.data} />
      )}
    </ComponentsLayout>
  );
};

export default Credits;
