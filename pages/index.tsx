import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

import { AddRounded as AddRoundedIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import ComponentsLayout from '../components/Layout';
import SportIcon from '../components/SportIcon';
import { useGetLeaguesQuery } from '../redux/api/leaguesApi';
import { RoundedButton } from '../styledComponents/Buttons';
import { RoundedCard } from '../styledComponents/Cards';
import ContainersHomeTodaysMatchesByLeagueId from '../containers/v2/Home/TodaysMatchesByLeagueId';

const Home: NextPage = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(null);

  const { data: session, status: sessionStatus } = useSession();
  const { data: getLeaguesData, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  useEffect(() => {
    if (!getLeaguesData) return;

    setSelectedLeagueId(getLeaguesData.data[0].id);
  }, [getLeaguesData]);

  return (
    <ComponentsLayout>
      <Stack>
        {sessionStatus === 'authenticated' ? (
          <Box id="user-component" p={3}>
            <Stack direction="row" spacing={1}>
              <Avatar>{`${session.user.name.split(' ')[0][0]}${
                session.user.name.split(' ')[1][0]
              }`}</Avatar>
              <RoundedButton>
                <Stack alignItems="center" direction="row">
                  <span>&#8369;0.00</span>
                  <AddRoundedIcon fontSize="small" />
                </Stack>
              </RoundedButton>
            </Stack>
          </Box>
        ) : (
          <Box p={3}>
            <Stack direction="row" spacing={2}>
              <RoundedButton size="large">Register</RoundedButton>
              <RoundedButton size="large">Sign In</RoundedButton>
            </Stack>
          </Box>
        )}

        {isGetLeaguesLoading ? (
          <CircularProgress />
        ) : (
          <Box id="leagues-list-component" p={3}>
            <Stack direction="row" spacing={1}>
              {getLeaguesData.data.map(({ id, sport: { id: sportId } }) => {
                const isButtonActive = id === selectedLeagueId;

                const sx = {
                  bgcolor: !isButtonActive && '#f9f9f9',
                  color: !isButtonActive && '#bdc3c7',
                };

                return (
                  <LoadingButton
                    key={id}
                    onClick={() => setSelectedLeagueId(id)}
                    sx={{ borderRadius: '1.5rem', boxShadow: 0, p: 2, ...sx }}
                    variant="contained"
                  >
                    <SportIcon sportId={sportId} />
                  </LoadingButton>
                );
              })}
            </Stack>
          </Box>
        )}

        <Box p={3}>
          <Box mb={2}>
            <Typography variant="h6">Today&apos;s Events</Typography>
          </Box>
          <ContainersHomeTodaysMatchesByLeagueId leagueId={selectedLeagueId} />
        </Box>
      </Stack>
    </ComponentsLayout>
  );
};

export default Home;
