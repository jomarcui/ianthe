import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { User } from '../../types';
import ContainersCreditsList from './List';

type CreditsProps = {
  users: User[];
};

const Credits = ({ users }: CreditsProps) => {
  const [mobileNumber, setMobileNumber] = useState<string>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>(null);

  const handleDialogClose = () => setSelectedUserId(null);

  const handleMobileNumberChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(event.target.value);
  };

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          inputProps={{
            maxLength: 11,
            placeholder: '0XXXXXXXXXX',
          }}
          InputLabelProps={{ shrink: true }}
          label="Mobile Number"
          onChange={handleMobileNumberChanged}
          value={mobileNumber}
        />
      </Box>
      <ContainersCreditsList
        mobileNumber={mobileNumber}
        setSelectedUserId={setSelectedUserId}
        users={users}
      />
      <Dialog open={Boolean(selectedUserId)} onClose={handleDialogClose}>
        <DialogTitle>Update User Credits</DialogTitle>
        <DialogContent>
          <DialogContentText>Some text.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Button onClick={handleDialogClose} variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained">Confirm</Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Credits;
