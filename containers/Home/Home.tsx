import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLeaguesQuery } from '../../redux/api/leaguesApi';

import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import SportsIcon from '../../components/SportsIcon';
import FullWidthTabs from '../../components/FullWidthTabs';
import SchedulesTabPanel from './SchedulesTabPanel';

const Home = () => {
  const [value, setValue] = useState(0);

  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();

  // const ws = new WebSocket(process.env.NEXT_PUBLIC_HOST.replace(/^http/, 'ws'));

  // ws.addEventListener('open', () => {
  //   ws.send('Hello, server!');
  // });

  // ws.addEventListener('message', (event) => {
  //   console.log('Message from server', event.data);
  // });

  return (
    <>
      <Box bgcolor="primary.main" p={1}>
        <Typography align="center" color="primary.contrastText">
          Today&apos;s events
        </Typography>
      </Box>

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
    </>
  );
};

export default Home;
