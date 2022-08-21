import { useGetMatchesByLeagueIdAndDateQuery } from '../../redux/api/matchesApi';
import { Card, CardContent, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import SchedulesCard from './SchedulesCard';

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

type SchedulesListProps = {
  leagueId: string;
};

const SchedulesList = ({ leagueId }: SchedulesListProps) => {
  const {
    data: getSchedulesByLeagueIdAndDateResponse,
    isLoading: isGetSchedulesByLeagueIdAndDateLoading,
  } = useGetMatchesByLeagueIdAndDateQuery({
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
