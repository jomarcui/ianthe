import { Key } from 'react';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { compareAsc, format, isToday } from 'date-fns';
import { useSchedulesQuery } from '../redux/api/schedulesApi';
import { Schedule } from '../types';
import { useTeamsQuery } from '../redux/api/teamsApi';
import { useLeaguesQuery } from '../redux/api/leaguesApi';
import Layout from '../components/Layout';
import leaguesUtils from '../utilities/leaguesUtils';
import teamsUtils from '../utilities/teamsUtils';
// import { skipToken } from '@reduxjs/toolkit/dist/query';

const Home = () => {
  const { data: leagues, error: isLeaguesError, isLoading: isLeaguesLoading } = useLeaguesQuery();
  const { data: schedules, isLoading: isSchedulesLoading } =
    useSchedulesQuery();
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

  const isLoading = isLeaguesLoading || isSchedulesLoading || isTeamsLoading;

  if (isLoading) {
    return (
      <Layout>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout>
    );
  }
  
  const bet = {
    odds: 0.2,
  };

  const leagueSchedules = leagues.map(({ _id }) => {
    const { initialism } = leaguesUtils(leagues).findById(_id);

    const schedule = schedules.filter(
      ({ date, leagueId }) => _id === leagueId && isToday(new Date(date))
    );

    return {
      initialism,
      schedules: [...schedule],
    };
  });

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
        {leagueSchedules.map(({ initialism, schedules }, index) => (
          <List disablePadding key={index}>
            <ListSubheader
              sx={{
                bgcolor: '#ecf0f1',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              <strong>{initialism}</strong>
            </ListSubheader>
            {schedules.map((schedule, index) => (
              <ScheduleListItem key={index} schedule={schedule} />
            ))}
          </List>
        ))}
      </Box>
    </Layout>
  );
};

const ScheduleListItem = ({
  schedule: {
    date,
    leagueId,
    status,
    teams: { home, visitor },
  },
}: {
  schedule: Schedule;
}) => {
  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();
  const { name: homeName } = teamsUtils(teams).findById(home);
  const { name: visitorName } = teamsUtils(teams).findById(visitor);

  const isSoon = compareAsc(new Date(date), new Date()) === 1;

  const primary = (
    <Stack>
      <Typography variant="caption">{homeName}</Typography>
      <Typography variant="caption">{visitorName}</Typography>
    </Stack>
  );

  const secondary = (
    <Typography variant="caption">
      {format(new Date(date), 'h:mm a')}
    </Typography>
  );

  return (
    <ListItem divider>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: '#ecf0f1' }}>
          <SportsBasketballIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
};

export default Home;
