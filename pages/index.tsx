import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ComponentsLayout from '../components/Layout';
import SportIcon from '../components/SportIcon';
import { useGetLeaguesQuery } from '../redux/api/leaguesApi';
import ContainersHomeTodaysMatchesByLeagueId from '../containers/v2/Home/TodaysMatchesByLeagueId';
import ContainersCommonUserActionBar from '../containers/Common/UserActionBar';

const Home: NextPage = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(null);

  const { data: getLeaguesData, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  useEffect(() => {
    if (!getLeaguesData) return;

    setSelectedLeagueId(getLeaguesData.data[0].id);
  }, [getLeaguesData]);

  return (
    <ComponentsLayout>
      <Stack>
        <ContainersCommonUserActionBar />
        {isGetLeaguesLoading ? (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box id="leagues-list-component" p={3}>
            <Box mb={2}>
              <Typography variant="h6">Select League</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {getLeaguesData.data.map(
                ({ id, initialism, sport: { id: sportId } }) => {
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
                      <Stack>
                        <SportIcon sportId={sportId} />
                        <div>{initialism}</div>
                      </Stack>
                    </LoadingButton>
                  );
                }
              )}
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
