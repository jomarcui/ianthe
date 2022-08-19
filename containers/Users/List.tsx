import Loader from '../../components/Loader';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetUsersQuery } from '../../redux/api/usersApi';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

const List = () => {
  const { data: usersResponse, isLoading: isUsersLoading } = useGetUsersQuery();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      width: 150,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 150,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
    },
  ];

  const rows = usersResponse?.data.map(({ firstName, id, lastName }) => ({
    firstName,
    id,
    lastName,
  }));

  return (
    <>
      <Stack my={3}>
        <Grid container>
          <Grid item sx={{ alignItems: 'center', display: 'flex' }} xs>
            <Typography variant="h6">Users List</Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'end' }} xs>
            <Button onClick={() => alert('Soon!')} variant="contained">
              Create User
            </Button>
          </Grid>
        </Grid>
      </Stack>
      {isUsersLoading && <Loader />}
      {usersResponse && (
        <DataGrid
          autoHeight
          columns={columns}
          disableSelectionOnClick
          rows={rows}
          sx={{ bgcolor: 'common.white' }}
        />
      )}
    </>
  );
};

export default List;
