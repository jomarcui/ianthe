import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useGetMatchesByLeagueIdQuery } from '../../redux/api/matchesApi';
import { League } from '../../types';
import ScheduleForm from './ScheduleForm';
import List from './List';

const renderSchedulesListContent = (schedules = []) =>
  !schedules.length ? (
    <Card>
      <CardContent>No schedules found.</CardContent>
    </Card>
  ) : (
    <List listItems={schedules} />
  );

const Schedules = ({ leagues }) => {
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League>(leagues[0]);

  const {
    data: getMatchesByLeagueIdResponse,
    isLoading: isGetMatchesByLeagueIdLoading,
  } = useGetMatchesByLeagueIdQuery(selectedLeague.id);

  const handleLeagueButtonClick = (leagueId: string) =>
    setSelectedLeague(leagues.find(({ id }) => id === leagueId));

  const handleScheduleFormOpen = () => setScheduleFormOpen(true);

  return (
    <Box>
      <Grid alignItems="center" container my={3}>
        <Grid item xs>
          <Typography variant="h6">Schedules List</Typography>
        </Grid>
        <Grid textAlign="right" item xs>
          <LoadingButton
            onClick={handleScheduleFormOpen}
            loading={false}
            variant="contained"
          >
            Add Schedule
          </LoadingButton>
        </Grid>
      </Grid>
      <Stack my={3} spacing={1}>
        <Typography>Select League</Typography>
        <Stack direction="row" spacing={1}>
          {leagues.map(({ id, initialism }) => {
            const isActive = id === selectedLeague.id;
            const sx = {
              bgcolor: !isActive && 'white',
              color: !isActive && 'text.primary',
            };

            return (
              <Button
                key={id}
                onClick={() => handleLeagueButtonClick(id)}
                sx={sx}
                variant="contained"
              >
                {initialism}
              </Button>
            );
          })}
        </Stack>
      </Stack>

      {isGetMatchesByLeagueIdLoading ? (
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </CardContent>
        </Card>
      ) : (
        renderSchedulesListContent(getMatchesByLeagueIdResponse.data)
      )}

      <ScheduleForm
        league={selectedLeague}
        open={scheduleFormOpen}
        setOpen={setScheduleFormOpen}
      />
    </Box>
  );
};

export default Schedules;
