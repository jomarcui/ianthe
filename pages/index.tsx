import { Key } from 'react';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
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
  const {
    data: leagues,
    error: isLeaguesError,
    isLoading: isLeaguesLoading,
  } = useLeaguesQuery();
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
      ({ date, leagueId }) => _id === leagueId && isToday(new Date(date)),
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
        <Typography m={1} component="h6" variant="h6">
          Today&apos;s events
        </Typography>
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
    <Grid container spacing={0.25}>
      <Grid item xs={8}>
        <Box p={1}>
        <Typography variant="caption">{homeName}</Typography>
        </Box>
        
      </Grid>
      <Grid item xs={4}>
        <Box p={1} sx={{bgcolor: '#EFEFEF', borderColor: '#EFEFEF'}}>
          <Typography variant="caption">4.15</Typography>
        </Box>
      </Grid>
      <Grid item xs={8}>
      <Box p={1}>
      <Typography variant="caption">{visitorName}</Typography>
</Box>
        
      </Grid>
      <Grid item xs={4}>
        <Box p={1} sx={{bgcolor: '#EFEFEF', borderColor: '#EFEFEF'}}>
          <Typography variant="caption">1.18</Typography>
        </Box>
      </Grid>
    </Grid>
    // <Stack>
    //   <Typography variant="caption">{homeName}</Typography>
    //   <Typography variant="caption">{visitorName}</Typography>
    // </Stack>
  );

  const secondary = (
    <Typography p={1} variant="caption">
      {format(new Date(date), 'h:mm a')}
    </Typography>
  );

  return (
    <ListItemButton divider>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: '#ecf0f1' }}>
          <SportsBasketballIcon />
        </Avatar>
      </ListItemAvatar>
      {/* <div>{primary}</div> */}
      <ListItemText primary={primary} />
    </ListItemButton>
  );
};

export default Home;
