import { List } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { useGetLeagueSchedulesByDateQuery } from '../../redux/api/schedulesApi';
import { useTeamsQuery } from '../../redux/api/teamsApi';

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

  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

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

              {teams && (
                <SchedulesListItem
                  isLoading={isTeamsLoading}
                  key={index}
                  schedule={schedule}
                  teams={teams}
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
