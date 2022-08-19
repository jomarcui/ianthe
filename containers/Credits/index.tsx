import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { User } from '../../types';
import ContainersCreditsForm from './Form';
import ContainersCreditsList from './List';
import { useCreateTransactionMutation } from '../../redux/api/transactionsApi';
import { LoadingButton } from '@mui/lab';

type CreditsProps = {
  users: User[];
};

const Credits = ({ users }: CreditsProps) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>(null);

  const [createTransaction, { isLoading: isCreateTransactionLoading }] =
    useCreateTransactionMutation();

  const selectedUser = useMemo(
    () => users.find(({ id }) => id === selectedUserId),
    [users, selectedUserId]
  );

  useEffect(() => {
    setSelectedUserId(null);
  }, [users]);

  const handleDialogClose = () => setSelectedUserId(null);

  const handleMobileNumberChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(event.target.value);
  };

  return (
    <>
      <Box my={3}>
        <Typography variant="h6">Users List</Typography>
      </Box>
      <Box>
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
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <ContainersCreditsForm
              createTransaction={createTransaction}
              user={selectedUser}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Button onClick={handleDialogClose} variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton
                loading={isCreateTransactionLoading}
                form="credits-form"
                type="submit"
                variant="contained"
              >
                Create
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Credits;
