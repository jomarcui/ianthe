import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import ComponentsLayout from '../components/Layout';
import SportIcon from '../components/SportIcon';
import { useGetLeaguesQuery } from '../redux/api/leaguesApi';
import ContainersHomeTodaysMatchesByLeagueId from '../containers/v2/Home/TodaysMatchesByLeagueId';
import ContainersCommonUserActionBar from '../containers/Common/UserActionBar';
import Image from 'next/image';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `league-tab-${index}`,
    'aria-controls': `league-tabpanel-${index}`,
  };
}

const Home: NextPage = () => {
  const [selectedLeague, setSelectedLeague] = useState<any>(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(
    '62e14be33b17ae7b977921e9'
  );

  const { data: getLeaguesData, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  useEffect(() => {
    if (!getLeaguesData) return;

    setSelectedLeague(getLeaguesData.data[0]);
    setSelectedLeagueId(getLeaguesData.data[0].id);
  }, [getLeaguesData]);

  const handleChange = (event: React.SyntheticEvent, newValue: any) =>
    setSelectedLeagueId(newValue);

  const Logo = {
    NBA: '/nba.png',
    PBA: '/pba.png',
    PVL: '/pvl.png',
  };

  return (
    <ComponentsLayout>
      <Box p={3}>
        <Stack spacing={3}>
          <ContainersCommonUserActionBar />

          <Card>
            <CardHeader title="Today's Events" />
            <CardContent>
              <Stack spacing={3}>
                <Box id="league-select">
                  {/* <Typography variant="h6">Today&apos;s Events</Typography> */}
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
                    // <Box id="leagues-list-component">
                    //   <Stack direction="row" spacing={1}>
                    //     {getLeaguesData.data.map((league) => {
                    //       const {
                    //         id,
                    //         initialism,
                    //         sport: { id: sportId },
                    //       } = league;
                    //       const isButtonActive = id === selectedLeague?.id;

                    //       const sx = {
                    //         bgcolor: !isButtonActive && '#f9f9f9',
                    //         color: !isButtonActive && '#bdc3c7',
                    //       };

                    //       return (
                    //         <LoadingButton
                    //           key={id}
                    //           onClick={() => setSelectedLeague(league)}
                    //           sx={{ borderRadius: '1.5rem', boxShadow: 0, p: 2, ...sx }}
                    //           variant={isButtonActive ? 'contained' : 'text'}
                    //         >
                    //           <Stack>
                    //             <Image
                    //               alt=""
                    //               height="75px"
                    //               src={Logo[initialism]}
                    //               width="177px"
                    //             />
                    //           </Stack>
                    //         </LoadingButton>
                    //       );
                    //     })}
                    //   </Stack>
                    // </Box>
                  )}
                </Box>
                <ContainersHomeTodaysMatchesByLeagueId
                  leagueId={selectedLeagueId}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </ComponentsLayout>
  );
};

export default Home;
