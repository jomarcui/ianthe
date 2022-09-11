import {
  Box,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
} from '@mui/material';
import {
  AddRounded as AddRoundedIcon,
  InfoRounded as InfoRoundedIcon,
} from '@mui/icons-material';
import { RoundedButton } from '../../styledComponents/Buttons';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const UserActionBar = () => {
  const [isAddCreditsDialogOpen, setIsAddCreditsDialogOpen] = useState(false);

  const { data: session, status: sessionStatus } = useSession();

  const handleAddCreditsButtonClick = () => setIsAddCreditsDialogOpen(true);

  const handleAddCreditsDialogClose = () => setIsAddCreditsDialogOpen(false);

  return (
    <>
      {sessionStatus === 'authenticated' ? (
        <Card id="user-action-bar">
          <CardContent>
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
                    <span>Please cash-in via GCash to 09XXXXXXXX</span>
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Stack direction="row" spacing={2}>
            <RoundedButton size="large">Register</RoundedButton>
            <RoundedButton size="large">Sign In</RoundedButton>
          </Stack>
        </Card>
      )}
    </>
  );
};

export default UserActionBar;
