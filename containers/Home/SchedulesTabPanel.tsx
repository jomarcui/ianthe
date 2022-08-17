import { List } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { useGetLeagueSchedulesByDateQuery } from '../../redux/api/schedulesApi';
import { useGetTeamsQuery } from '../../redux/api/teamsApi';

import Loader from '../../components/Loader';
import SchedulesListItem from '../../components/SchedulesListItem';
import TabPanel from '../../components/TabPanel';

type SchedulesTabPanelProps = {
  leagueId: string;
  value: number;
};

const SchedulesTabPanel = ({ leagueId, value }: SchedulesTabPanelProps) => {
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
    <TabPanel index={value} value={value}>
      {isSchedulesLoading && <Loader />}

      {schedules && (
        <List disablePadding>
          {schedules.map((schedule, index) => (
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
        </List>
      )}
    </TabPanel>
  );
};

export default SchedulesTabPanel;
