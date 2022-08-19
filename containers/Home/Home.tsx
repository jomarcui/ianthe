import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useLeaguesQuery } from '../../redux/api/leaguesApi';
import Loader from '../../components/Loader';
import SportsIcon from '../../components/SportsIcon';
import ComponentsFullWidthTabs from '../../components/FullWidthTabs';
import SchedulesTabPanel from './SchedulesTabPanel';

const Home = () => {
  // const [value, setValue] = useState(0);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(null);

  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();

  useEffect(() => {
    if (!leagues) return;

    setSelectedLeagueId(leagues[0].id);
  }, [leagues]);

  // const ws = new WebSocket(process.env.NEXT_PUBLIC_HOST.replace(/^http/, 'ws'));

  // ws.addEventListener('open', () => {
  //   ws.send('Hello, server!');
  // });

  // ws.addEventListener('message', (event) => {
  //   console.log('Message from server', event.data);
  // });

  return (
    <>
      <Box>
        <Typography variant="h6">Today&apos;s events</Typography>
      </Box>

      {isLeaguesLoading && <Loader />}

      {leagues && (
        <Stack spacing={2}>
          <Typography>Select League</Typography>
          <Stack direction="row" spacing={1}>
            {leagues.map(({ id, initialism }, index) => {
              const bgcolor = selectedLeagueId !== id && 'white';
              const color = selectedLeagueId !== id && 'text.primary';

              return (
                <Button
                  key={index}
                  onClick={() => setSelectedLeagueId(id)}
                  sx={{ bgcolor, color }}
                  variant="contained"
                >
                  {initialism}
                </Button>
              );
            })}
          </Stack>

          {/* <ComponentsFullWidthTabs
            setValue={setValue}
            tabs={leagues.map(({ id, initialism, sportId }) => ({
              header: { key: id, label: initialism },
              icon: <SportsIcon sportId={sportId} />,
            }))}
            value={value}
          /> */}
          <SchedulesTabPanel leagueId={selectedLeagueId} />
        </Stack>
      )}
    </>
  );
};

export default Home;
