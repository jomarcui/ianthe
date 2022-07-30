import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { isToday } from 'date-fns';
import { useSchedulesQuery } from '../redux/api/schedulesApi';
import { useTeamsQuery } from '../redux/api/teamsApi';
import { useLeaguesQuery } from '../redux/api/leaguesApi';
import Layout from '../components/Layout';
import leaguesUtils from '../utilities/leaguesUtils';
import SchedulesListItem from '../components/SchedulesListItem';
import SportsIcon from '../components/SportsIcon';
import Loader from '../components/Loader/Loader';

const StyledListSubheader = styled(ListSubheader)`
  background-color: #ecf0f1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 1rem;
`;

const StyledTitleContainer = styled(Box)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 1rem;
`;

const Home = () => {
  const [skipSchedules, setSkipSchedules] = useState(true);
  const [skipTeams, setSkipTeams] = useState(true);

  const {
    data: leagues,
    isLoading: isLeaguesLoading,
    isUninitialized: isLeaguesUninitialiazed,
  } = useLeaguesQuery();

  const {
    data: schedules,
    isLoading: isSchedulesLoading,
    isUninitialized: isSchedulesUninitialized,
  } = useSchedulesQuery(undefined, { skip: skipSchedules });

  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery(undefined, {
    skip: skipTeams,
  });

  useEffect(() => {
    if (!isLeaguesUninitialiazed) setSkipSchedules(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagues]);

  useEffect(() => {
    if (!isSchedulesUninitialized) setSkipTeams(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

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
          <Typography component="h6" variant="h6">
            Today&apos;s events
          </Typography>
        </StyledTitleContainer>

        {isLeaguesLoading && (
          <List disablePadding>
            <StyledListSubheader>
              <Loader />
            </StyledListSubheader>
          </List>
        )}

        {leagues &&
          leagues.map(({ _id, sportsId }) => {
            const { initialism } = leaguesUtils(leagues).findById(_id);

            return (
              <List disablePadding key={initialism}>
                <StyledListSubheader>
                  <Stack direction="row" spacing={1}>
                    <SportsIcon sportsId={sportsId} />
                    <Typography variant="body1">{initialism}</Typography>
                  </Stack>
                </StyledListSubheader>

                {isSchedulesLoading && (
                  <>
                    <ListItem>
                      <ListItemText primary={<Loader />} />
                    </ListItem>
                  </>
                )}

                {schedules &&
                  schedules
                    .filter(
                      ({ date, leagueId }) =>
                        _id === leagueId && isToday(new Date(date))
                    )
                    .map((schedule, index) => (
                      <React.Fragment key={schedule._id}>
                        {isTeamsLoading && <Loader />}

                        {teams && (
                          <>
                            <SchedulesListItem
                              isLoading={isTeamsLoading}
                              key={index}
                              schedule={schedule}
                              teams={teams}
                            />
                          </>
                        )}
                      </React.Fragment>
                    ))}
              </List>
            );
          })}
      </Box>
    </Layout>
  );
};

export default Home;
