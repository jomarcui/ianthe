import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
  Backdrop,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import ComponentsLayout from '../components/Layout';
import { useGetLeaguesQuery } from '../redux/api/leaguesApi';
import ContainersHomeTodaysMatchesByLeagueId from '../containers/v2/Home/TodaysMatchesByLeagueId';
import ContainersCommonUserActionCard from '../containers/Common/UserActionCard';
import Image from 'next/image';

function a11yProps(index: number) {
  return {
    id: `league-tab-${index}`,
    'aria-controls': `league-tabpanel-${index}`,
  };
}

const Home: NextPage = () => {
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  // TODO: Remove hard code
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(
    '62e14be33b17ae7b977921e9'
  );

  const { data: getLeaguesData, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  useEffect(() => {
    if (!getLeaguesData) return;

    setSelectedLeagueId(getLeaguesData.data[0].id);
  }, [getLeaguesData]);

  const handleChange = (event: React.SyntheticEvent, newValue: any) =>
    setSelectedLeagueId(newValue);

  // TODO: Put in configuration
  const Logo = {
    NBA: '/nba.png',
    PBA: '/pba.png',
    PVL: '/pvl.png',
  };

  return (
    <ComponentsLayout>
      <Box p={3} width="100%">
        <Stack spacing={3}>
          <ContainersCommonUserActionCard />
          <Box>
            <Typography variant="h6">Today&apos;s Events</Typography>
            <Stack spacing={3}>
              <Box id="league-select">
                {isGetLeaguesLoading ? (
                  <Box textAlign="center">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      aria-label="league tabs"
                      onChange={handleChange}
                      value={selectedLeagueId}
                    >
                      {getLeaguesData.data.map(
                        (league: { id: string; initialism: string }) => {
                          const { id, initialism } = league;

                          return (
                            <Tab
                              key={id}
                              label={
                                <Image
                                  alt=""
                                  height="21px"
                                  layout="fixed"
                                  src={Logo[initialism]}
                                  width="50px"
                                />
                              }
                              value={id}
                              {...a11yProps(0)}
                            />
                          );
                        }
                      )}
                    </Tabs>
                  </Box>
                )}
              </Box>
              <ContainersHomeTodaysMatchesByLeagueId
                leagueId={selectedLeagueId}
                setIsBackdropOpen={setIsBackdropOpen}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ComponentsLayout>
  );
};

export default Home;
