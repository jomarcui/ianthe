import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

import {
  AddRounded as AddRoundedIcon,
  InfoRounded as InfoRoundedIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [isAddCreditsDialogOpen, setIsAddCreditsDialogOpen] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(null);

  const { data: session, status: sessionStatus } = useSession();
  const { data: getLeaguesData, isLoading: isGetLeaguesLoading } =
    useGetLeaguesQuery();

  useEffect(() => {
    if (!getLeaguesData) return;

    setSelectedLeagueId(getLeaguesData.data[0].id);
  }, [getLeaguesData]);

  const handleAddCreditsButtonClick = () => setIsAddCreditsDialogOpen(true);

  const handleAddCreditsDialogClose = () => setIsAddCreditsDialogOpen(false);

  return (
    <ComponentsLayout>
      <Stack>
        {sessionStatus === 'authenticated' ? (
          <Box id="user-component" p={3}>
            <Stack direction="row" spacing={1}>
              <Avatar>{`${session.user.name.split(' ')[0][0]}${
                session.user.name.split(' ')[1][0]
              }`}</Avatar>
              <RoundedButton onClick={handleAddCreditsButtonClick}>
                <Stack alignItems="center" direction="row">
                  <span>&#8369;0.00</span>
                  <AddRoundedIcon fontSize="small" />
                </Stack>
              </RoundedButton>
            </Stack>
            <Dialog
              open={isAddCreditsDialogOpen}
              onClose={handleAddCreditsDialogClose}
              aria-labelledby="add-credits-dialog-title"
              aria-describedby="add-credits-dialog-description"
            >
              <DialogTitle id="add-credits-dialog-title">
                Add Credits
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="add-credits-dialog-description">
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <InfoRoundedIcon color="info" fontSize="large" />
                    <Typography>
                      Please cash-in via GCash to 09XXXXXXXX
                    </Typography>
                  </Stack>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <RoundedButton
                  size="large"
                  onClick={handleAddCreditsDialogClose}
                >
                  OK
                </RoundedButton>
              </DialogActions>
            </Dialog>
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
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
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
