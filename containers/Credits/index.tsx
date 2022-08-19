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
// import titleize from 'titleize';
import ContainersCreditsForm from './Form';
import ContainersCreditsList from './List';
// import AppBreadcrumbs from '../../components/AppBreadcrumbs';

type CreditsProps = {
  users: User[];
};

const Credits = ({ users }: CreditsProps) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>(null);

  const selectedUser = useMemo(
    () => users.find(({ id }) => id === selectedUserId),
    [users, selectedUserId]
  );

  // const getDefaultTextGenerator = useCallback(
  //   (subpath: string) => titleize(subpath),
  //   []
  // );

  // Assuming `fetchAPI` loads data from the API and this will use the
  // parameter name to determine how to resolve the text. In the example,
  // we fetch the post from the API and return it's `title` property
  // const getTextGenerator = useCallback((param, query) => {
  //   return {
  //     "post_id": () => await fetchAPI(`/posts/${query.post_id}/`).title,
  //   }[param];
  // }, []);

  useEffect(() => {
    setSelectedUserId(null);
  }, [users]);

  const handleDialogClose = () => setSelectedUserId(null);

  const handleMobileNumberChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(event.target.value);
  };

  return (
    <>
      {/* <AppBreadcrumbs getDefaultTextGenerator={getDefaultTextGenerator} /> */}
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
          {selectedUser && <ContainersCreditsForm user={selectedUser} />}
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
    </>
  );
};

export default Credits;
