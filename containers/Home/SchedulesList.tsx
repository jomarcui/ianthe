import { useGetSchedulesByLeagueIdAndDateQuery } from '../../redux/api/schedulesApi';
import { Card, CardContent, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import SchedulesCard from './SchedulesCard';

type SchedulesListProps = {
  leagueId: string;
};

const renderSchedulesListContent = (schedules = []) =>
  !schedules.length ? (
    <Card>
      <CardContent>No schedules found.</CardContent>
    </Card>
  ) : (
    schedules.map((schedule) => (
      <SchedulesCard key={schedule.id} schedule={schedule} />
    ))
  );

const SchedulesList = ({ leagueId }: SchedulesListProps) => {
  const {
    data: getSchedulesByLeagueIdAndDateResponse,
    isLoading: isGetSchedulesByLeagueIdAndDateLoading,
  } = useGetSchedulesByLeagueIdAndDateQuery({
    date: new Date().toDateString(),
    id: leagueId,
  });

  return (
    <>
      {isGetSchedulesByLeagueIdAndDateLoading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        renderSchedulesListContent(getSchedulesByLeagueIdAndDateResponse.data)
      )}
    </>
  );
};

export default SchedulesList;
