import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useCreateTransactionMutation } from '../../redux/api/transactionsApi';
import { User } from '../../types';
import ContainersCreditsForm from './Form';
import ContainersCreditsList from './List';

type CreditsProps = {
  users: User[];
};

const Credits = ({ users }: CreditsProps) => {
  const [mobileNumber, setMobileNumber] = useState<string>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>(null);

  useEffect(() => {
    setSelectedUserId(null);
  }, [users]);

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
          <ContainersCreditsForm userId={selectedUserId} />
        </DialogContent>
        <DialogActions>
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Button onClick={handleDialogClose} variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button form="credits-form" type="submit" variant="contained">
                Confirm
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Credits;
