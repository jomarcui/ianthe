import React, { useEffect, useState } from 'react';
import CellTowerIcon from '@mui/icons-material/CellTower';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { LoadingButton } from '@mui/lab';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { compareAsc } from 'date-fns';

import { useTeamsQuery } from '../../redux/api/teamsApi';
import ScheduleForm from './ScheduleForm';
import { useLeaguesQuery } from '../../redux/api/leaguesApi';
import { useSchedulesQuery } from '../../redux/api/schedulesApi';

const getStatusIcon = (dayScheduled: Date) => {
  const result = compareAsc(dayScheduled, new Date());

  switch (result) {
    case -1:
      return <DoneIcon color="info" titleAccess="Event finished" />;

    case 0:
      return <CellTowerIcon color="success" titleAccess="Live" />;

    case 1:
      return <ScheduleIcon color="warning" titleAccess="Happening soon" />;
  }
};

const Schedules = () => {
  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();
  const { data: schedules, isLoading: isSchedulesLoading } =
    useSchedulesQuery();
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<string>(
    '62e14be33b17ae7b977921e9',
  );

  useEffect(() => {
    if (isLeaguesLoading) return;

    setSelectedLeague(leagues[0]['_id']);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagues]);

  const isLoading = isLeaguesLoading || isSchedulesLoading || isTeamsLoading;
  const schedulesFiltered = schedules?.filter(
    ({ leagueId }) => leagueId === selectedLeague,
  );
  const tableHeaders = ['Status', 'Teams', 'Date', 'Time', 'Actions'];

  const handleChange = (event: React.SyntheticEvent, newValue: string) =>
    setSelectedLeague(newValue);

  const handleScheduleFormOpen = () => setScheduleFormOpen(true);

  return (
    <>
      <Box>
        <Typography my={2} component="h6" align="center" variant="h6">
          Game Schedule
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            aria-label="secondary tabs example"
            indicatorColor="secondary"
            onChange={handleChange}
            textColor="secondary"
            value={selectedLeague}
            variant="fullWidth"
          >
            {leagues?.length &&
              leagues.map(({ _id, initialism }) => (
                <Tab key={_id} label={initialism} value={_id} />
              ))}
          </Tabs>
        </Box>
        <SchedulesTable
          data={{ headers: tableHeaders, body: schedulesFiltered }}
        />
        <Box m={2} textAlign="end">
          <LoadingButton
            onClick={handleScheduleFormOpen}
            loading={false}
            variant="contained"
          >
            Add Schedule
          </LoadingButton>
        </Box>
        <ScheduleForm
          leagueId={selectedLeague}
          open={scheduleFormOpen}
          setOpen={setScheduleFormOpen}
          sportId="62e14b643b17ae7b977921e8"
        />
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

const SchedulesTable = ({ data: { headers = [], body = [] } }) => {
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

  if (isTeamsLoading) return null;

  return (
    <List>
      {body.map(
        ({
          date,
          teams: { home, visitor },
        }: {
          date: Date;
          teams: { home: string; visitor: string };
        }) => {
          const dayScheduled = new Date(date);
          const { name: homeName } = teams.find(({ _id }) => _id === home);
          const { name: visitorName } = teams.find(
            ({ _id }) => _id === visitor,
          );

          const key = `${homeName}${visitorName}${dayScheduled}`;
          const statusIcon = getStatusIcon(dayScheduled);

          const primary = (() => (
            <Stack>
              <div>{homeName}</div>
              <div>vs</div>
              <div>{visitorName}</div>
            </Stack>
          ))();

          return (
            <ListItem
              key={key}
              secondaryAction={
                <IconButton>
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>{statusIcon}</ListItemAvatar>
              <ListItemText
                primary={primary}
                secondary={dayScheduled.toDateString()}
              />
            </ListItem>
          );
        },
      )}
    </List>
  );
};

export default Schedules;
