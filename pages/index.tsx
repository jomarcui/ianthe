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
import Image from 'next/image';

const Home: NextPage = () => {
  const [selectedLeague, setSelectedLeague] = useState<any>(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(null);

  const { data: getLeaguesData, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  useEffect(() => {
    if (!getLeaguesData) return;

    setSelectedLeague(getLeaguesData.data[0]);
    // setSelectedLeagueId(getLeaguesData.data[0].id);
  }, [getLeaguesData]);

  const Logo = {
    NBA: '/nba.png',
    PBA: '/pba.png',
    PVL: '/pvl.png',
  };

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
            {/* <Box mb={2}>
              <Typography variant="h6">Select League</Typography>
            </Box> */}
            <Stack direction="row" spacing={1}>
              {getLeaguesData.data.map((league) => {
                const {
                  id,
                  initialism,
                  sport: { id: sportId },
                } = league;
                const isButtonActive = id === selectedLeague?.id;

                const sx = {
                  bgcolor: !isButtonActive && '#f9f9f9',
                  color: !isButtonActive && '#bdc3c7',
                };

                return (
                  <LoadingButton
                    key={id}
                    onClick={() => setSelectedLeague(league)}
                    sx={{ borderRadius: '1.5rem', boxShadow: 0, p: 2, ...sx }}
                    variant={isButtonActive ? 'contained' : 'text'}
                  >
                    <Stack>
                      <Image
                        alt=""
                        height="75px"
                        src={Logo[initialism]}
                        width="177px"
                      />
                    </Stack>
                  </LoadingButton>
                );
              })}
            </Stack>
          </Box>
        )}

        <Box p={3}>
          <Box mb={2}>
            <Typography variant="h6">
              Today&apos;s {selectedLeague?.initialism} Events
            </Typography>
          </Box>
          <ContainersHomeTodaysMatchesByLeagueId
            leagueId={selectedLeague?.id}
          />
        </Box>
      </Stack>
    </ComponentsLayout>
  );
};

export default Home;
