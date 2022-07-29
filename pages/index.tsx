import { useEffect, useState } from 'react';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import {
  Avatar,
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

const Home = () => {
  const [skipLeagues, setSkipLeagues] = useState(true);
  const [skipSchedules, setSkipSchedules] = useState(true);

  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery(
    undefined,
    { skip: skipLeagues }
  );

  const { data: schedules, isLoading: isSchedulesLoading } = useSchedulesQuery(
    undefined,
    { skip: skipSchedules }
  );

  useEffect(() => {
    setSkipLeagues(false);
  }, []);

  useEffect(() => {
    setSkipSchedules(false);
  }, [leagues]);

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
        <Box sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', p: 1 }}>
          <Typography component="h6" variant="h6">
            Today&apos;s events
          </Typography>
        </Box>

        {isLeaguesLoading && (
          <List disablePadding>
            <ListSubheader
              sx={{
                bgcolor: '#ecf0f1',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                p: 1,
              }}
            >
              <Loader
                Text={<Typography variant="body1">Loading leagues</Typography>}
              />
            </ListSubheader>
          </List>
        )}

        {leagues && (
          <>
            {leagues.map(({ _id, sportsId }) => {
              const { initialism } = leaguesUtils(leagues).findById(_id);

              return (
                <List disablePadding key={initialism}>
                  <ListSubheader
                    sx={{
                      bgcolor: '#ecf0f1',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                      p: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <SportsIcon sportsId={sportsId} />
                      <Typography variant="body1">{initialism}</Typography>
                    </Stack>
                  </ListSubheader>

                  {isSchedulesLoading && (
                    <>
                      <ListItem>
                        <Loader />
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
                        <ScheduleListItem key={index} schedule={schedule} />
                      ))}
                </List>
              );
            })}
          </>
        )}
      </Box>
    </Layout>
  );
};

const ScheduleListItem = ({
  schedule: {
    date,
    sportId,
    teams: { home, visitor },
  },
}: {
  schedule: Schedule;
}) => {
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

  if (isTeamsLoading) {
    return (
      <ListItem>
        <Loader />
      </ListItem>
    );
  }

  const { name: homeName } = teamsUtils(teams).findById(home);
  const { name: visitorName } = teamsUtils(teams).findById(visitor);

  const primary = (
    <Grid container spacing={0.25}>
      <Grid item xs={10}>
        <Box p={1}>
          <Typography>{homeName}</Typography>
        </Box>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'right' }}>
        <Box
          sx={{
            bgcolor: '#EFEFEF',
            borderColor: '#EFEFEF',
            display: 'inline-block',
            p: 1,
            ml: 'auto',
          }}
        >
          <Typography>4.15</Typography>
        </Box>
      </Grid>
      <Grid item xs={10}>
        <Box p={1}>
          <Typography>{visitorName}</Typography>
        </Box>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'right' }}>
        <Box
          sx={{
            bgcolor: '#EFEFEF',
            borderColor: '#EFEFEF',
            display: 'inline-block',
            p: 1,
            ml: 'auto',
          }}
        >
          <Typography>1.18</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography p={1}>{format(new Date(date), 'h:mm a')}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <ListItemButton divider>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: '#ecf0f1' }}>
          <SportsIcon sportsId={sportId} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={primary} />
    </ListItemButton>
  );
};

const Loader = ({ Text }: { Text?: React.ReactNode }) => (
  <Stack direction="row" spacing={1}>
    <CircularProgress size="1rem" />
    {Text && Text}
  </Stack>
);

const SportsIcon = ({ sportsId }) => {
  switch (sportsId) {
    case '62e14b643b17ae7b977921e8':
      return <SportsBasketballIcon />;

    case '62e14b553b17ae7b977921e7':
      return <SportsBaseballIcon />;

    default:
      return <SportsVolleyballIcon />;
  }
};

export default Home;
