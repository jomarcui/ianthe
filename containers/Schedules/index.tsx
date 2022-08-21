import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
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
import { RoundedButton } from '../../styles/buttons';
import { RoundedCard } from '../../styles/Cards';

const renderSchedulesListContent = (schedules = []) =>
  !schedules.length ? (
    <RoundedCard>
      <CardContent>No schedules found.</CardContent>
    </RoundedCard>
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
            loading={false}
            onClick={handleScheduleFormOpen}
            size="large"
            sx={{ borderRadius: '2rem' }}
            variant="contained"
          >
            Create
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
              borderRadius: '2rem',
              color: !isActive && 'text.primary',
            };

            return (
              <RoundedButton
                key={id}
                onClick={() => handleLeagueButtonClick(id)}
                size="large"
                sx={sx}
                variant="contained"
              >
                {initialism}
              </RoundedButton>
            );
          })}
        </Stack>
      </Stack>

      {isGetMatchesByLeagueIdLoading ? (
        <RoundedCard>
          <CardContent sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </CardContent>
        </RoundedCard>
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
