import { Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { useGetTeamsQuery } from '../../redux/api/teamsApi';

const TeamSelectMenuItemLoading = (
  <MenuItem sx={{ textAlign: 'center' }}>
    <CircularProgress />
  </MenuItem>
);

const TeamSelect = ({ field, leagueId, watchField }) => {
  const { data: teamsResponse, isLoading: isTeamsLoading } = useGetTeamsQuery();

  return (
    <Select {...field}>
      {isTeamsLoading
        ? TeamSelectMenuItemLoading
        : teamsResponse.data
            .filter(({ leagueId: dataLeagueId }) => dataLeagueId === leagueId)
            .map(({ id, name }) => (
              <MenuItem disabled={id === watchField} key={id} value={id}>
                {name}
              </MenuItem>
            ))}
    </Select>
  );
};

export default TeamSelect;
