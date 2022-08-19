import { Fragment, useEffect } from 'react';
import { useGetLeagueSchedulesByDateQuery } from '../../redux/api/schedulesApi';
import { useGetTeamsQuery } from '../../redux/api/teamsApi';
import Loader from '../../components/Loader';
import SchedulesListItem from '../../components/SchedulesListItem';

type SchedulesTabPanelProps = {
  leagueId: string;
};

const SchedulesTabPanel = ({ leagueId }: SchedulesTabPanelProps) => {
  const {
    data: schedules,
    isLoading: isSchedulesLoading,
    refetch: refetchSchedules,
  } = useGetLeagueSchedulesByDateQuery({
    leagueId,
    date: new Date().toDateString(),
  });

  const { data: teamsResponse, isLoading: isTeamsLoading } = useGetTeamsQuery();

  useEffect(() => {
    refetchSchedules();
  }, [leagueId, refetchSchedules]);

  return (
    <>
      {isSchedulesLoading && <Loader />}

      {schedules &&
        schedules.map((schedule, index) => (
          <Fragment key={schedule.id}>
            {isTeamsLoading && <Loader />}

            {teamsResponse && (
              <SchedulesListItem
                isLoading={isTeamsLoading}
                key={index}
                schedule={schedule}
                teams={teamsResponse.data}
              />
            )}
          </Fragment>
        ))}
    </>
  );
};

export default SchedulesTabPanel;
