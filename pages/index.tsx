import { Fragment, ReactNode, useEffect, useState } from 'react';
import { Box, List, Typography } from '@mui/material';
import { useGetLeagueSchedulesByDateQuery } from '../redux/api/schedulesApi';
import { useTeamsQuery } from '../redux/api/teamsApi';
import { useLeaguesQuery } from '../redux/api/leaguesApi';
import styled from '@emotion/styled';
import Layout from '../components/Layout';
import SchedulesListItem from '../components/SchedulesListItem';
import SportsIcon from '../components/SportsIcon';
import Loader from '../components/Loader/Loader';
import FullWidthTabs from '../components/FullWidthTabs';

type SchedulesTabPanelProps = {
  leagueId: string;
  value: number;
};

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

const StyledTitleContainer = styled(Box)`
  background-color: #1976d2;
  padding: 1rem;
`;

const Home = () => {
  const [value, setValue] = useState(0);

  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();

  // const ws = new WebSocket('ws://localhost:5000');

  // ws.addEventListener('open', () => {
  //   ws.send('Hello, server!');
  // });

  // ws.addEventListener('message', (event) => {
  //   console.log('Message from server', event.data);
  // });

  return (
    <Layout>
      <Box>
        <StyledTitleContainer>
          <Typography
            align="center"
            color="common.white"
            component="h6"
            variant="h6"
          >
            Today&apos;s events
          </Typography>
        </StyledTitleContainer>

        {isLeaguesLoading && <Loader />}

        {leagues && (
          <>
            <FullWidthTabs
              setValue={setValue}
              tabs={leagues.map(({ id, initialism, sportId }) => ({
                header: { key: id, label: initialism },
                icon: <SportsIcon sportId={sportId} />,
              }))}
              value={value}
            />
            <SchedulesTabPanel leagueId={leagues[value].id} value={value} />
          </>
        )}
      </Box>
    </Layout>
  );
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueId]);

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

const TabPanel = ({ children, index, value, ...other }: TabPanelProps) => (
  <div
    aria-labelledby={`full-width-tab-${index}`}
    id={`full-width-tabpanel-${index}`}
    hidden={value !== index}
    role="tabpanel"
    {...other}
  >
    {value === index && <Box>{children}</Box>}
  </div>
);

export default Home;
