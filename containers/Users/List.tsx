import Loader from "../../components/Loader";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetUsersQuery } from "../../redux/api/usersApi";
import { Box } from "@mui/material";

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
    <Box sx={{ height: '100vh', width: '100%' }}>
      {isUsersLoading && <Loader />}

      {usersResponse && (
        <DataGrid columns={columns} disableSelectionOnClick rows={rows} />
      )}
    </Box>
  );
}

export default List;