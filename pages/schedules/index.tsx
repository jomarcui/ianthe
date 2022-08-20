import { NextPage } from 'next';
import { Backdrop, CircularProgress } from '@mui/material';
import { useGetLeaguesQuery } from '../../redux/api/leaguesApi';
import ComponentsLayout from '../../components/Layout';
import ContainersSchedules from '../../containers/Schedules';

const Schedules: NextPage = () => {
  const { data: getLeaguesResponse, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  return (
    <ComponentsLayout>
      {isGetLeaguesLoading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isGetLeaguesLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <ContainersSchedules leagues={getLeaguesResponse.data} />
      )}
    </ComponentsLayout>
  );
};

export default Schedules;
