import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useGetLeaguesQuery } from '../../redux/api/leaguesApi';
import { Today as TodayIcon } from '@mui/icons-material';
import Loader from '../../components/Loader';
import SchedulesList from './SchedulesList';

const Home = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(null);

  const { data: getLeaguesResponse, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  useEffect(() => {
    if (!getLeaguesResponse) return;

    setSelectedLeagueId(getLeaguesResponse.data[0].id);
  }, [getLeaguesResponse]);

  // const ws = new WebSocket(process.env.NEXT_PUBLIC_HOST.replace(/^http/, 'ws'));

  // ws.addEventListener('open', () => {
  //   ws.send('Hello, server!');
  // });

  // ws.addEventListener('message', (event) => {
  //   console.log('Message from server', event.data);
  // });

  const leagues = getLeaguesResponse?.data;

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        display="flex"
        my={3}
        spacing={1}
      >
        <TodayIcon />
        <Typography variant="h6">Today&apos;s events</Typography>
      </Stack>

      {isGetLeaguesLoading ? (
        <Loader />
      ) : (
        <>
          <Stack my={3} spacing={1}>
            <Typography>Select League</Typography>
            <Stack direction="row" spacing={1}>
              {leagues.map(({ id, initialism }, index) => {
                const isActive = id === selectedLeagueId;
                const sx = {
                  bgcolor: !isActive && 'white',
                  color: !isActive && 'text.primary',
                };

                return (
                  <Button
                    key={index}
                    onClick={() => setSelectedLeagueId(id)}
                    sx={sx}
                    variant="contained"
                  >
                    {initialism}
                  </Button>
                );
              })}
            </Stack>
          </Stack>
          <Stack my={3} spacing={2}>
            {selectedLeagueId && <SchedulesList leagueId={selectedLeagueId} />}
          </Stack>
        </>
      )}
    </>
  );
};

export default Home;
