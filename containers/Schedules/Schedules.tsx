import React, { useEffect, useState } from 'react';
import CellTowerIcon from '@mui/icons-material/CellTower';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { LoadingButton } from '@mui/lab';
import {
  alpha,
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { compareAsc, format, isToday } from 'date-fns';

import { useTeamsQuery } from '../../redux/api/teamsApi';
import { useLeaguesQuery } from '../../redux/api/leaguesApi';
import {
  useDeleteScheduleMutation,
  useSchedulesQuery,
  useUpdateScheduleStatusMutation,
} from '../../redux/api/schedulesApi';
import ScheduleForm from './ScheduleForm';
import { useSportsQuery } from '../../redux/api/sportsApi';
import { Status } from '../../enums';
import { League, Schedule } from '../../types';
import Loader from '../../components/Loader/Loader';
import ListItemAvatar from '../../components/ListItemAvatar';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case Status.Ended:
      return <CheckCircleIcon color="disabled" titleAccess="Match has ended" />;

    case Status.Live:
      return <CellTowerIcon color="success" titleAccess="Live" />;

    case Status.Soon:
      return <ScheduleIcon color="info" titleAccess="Happening soon" />;
  }
};

const Schedules = () => {
  const [skipLeagues, setSkipLeagues] = useState(true);
  const [skipSchedules, setSkipSchedules] = useState(true);
  const [skipSports, setSkipSports] = useState(true);
  const [skipTeams, setSkipTeams] = useState(true);

  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();
  const { data: schedules, isLoading: isSchedulesLoading } = useSchedulesQuery(
    undefined,
    { skip: skipSchedules }
  );
  const { data: sports, isLoading: isSportsLoading } = useSportsQuery(
    undefined,
    { skip: skipSports }
  );
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery(undefined, {
    skip: skipTeams,
  });

  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League>();
  // const [selectedSportId, setSelectedSportId] = useState(
  //   '62e14b643b17ae7b977921e8'
  // );

  useEffect(() => {
    if (leagues) {
      setSelectedLeague(leagues[0]);
      setSkipSchedules(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagues]);

  const handleChange = (_event: React.SyntheticEvent, leagueId: string) => {
    setSelectedLeague(leagues.find(({ id }) => id === leagueId));

    // const { sportId } = teams.find(({ leagueId }) => leagueId === newValue);
    // const { id: id } = sports.find(({ id }) => id === sportId);

    // setSelectedSportId(id);
  };

  const handleScheduleFormOpen = () => setScheduleFormOpen(true);

  return (
    <>
      <Box>
        <Typography my={2} component="h6" align="center" variant="h6">
          Schedules
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {isLeaguesLoading && <Loader />}

          {leagues && selectedLeague && (
            <Tabs
              aria-label="secondary tabs example"
              indicatorColor="secondary"
              onChange={handleChange}
              textColor="secondary"
              value={selectedLeague.id}
              variant="fullWidth"
            >
              {leagues.map(({ id, initialism }) => (
                <Tab key={id} label={initialism} value={id} />
              ))}
            </Tabs>
          )}
        </Box>

        {isSchedulesLoading && <Loader />}

        {schedules && (
          <SchedulesList
            listItems={schedules.filter(
              ({ leagueId }) => leagueId === selectedLeague.id
            )}
          />
        )}

        <Box m={2} textAlign="end">
          <LoadingButton
            onClick={handleScheduleFormOpen}
            loading={false}
            variant="contained"
          >
            Add Schedule
          </LoadingButton>
        </Box>

        {schedules && (
          <ScheduleForm
            league={selectedLeague}
            open={scheduleFormOpen}
            setOpen={setScheduleFormOpen}
          />
        )}
      </Box>
    </>
  );
};

const SchedulesList = ({ listItems = [] }) => {
  const [scheduleIdSelected, setScheduleIdSelected] = useState(null);

  const { data: teams } = useTeamsQuery();

  const [deleteSchedule, { isLoading: isScheduleDeleting }] =
    useDeleteScheduleMutation();

  const [updateScheduleStatus, { isLoading: isScheduleUpdating }] =
    useUpdateScheduleStatusMutation();

  const handleDelete = async (id: string) => {
    setScheduleIdSelected(id);

    await deleteSchedule(id);

    setScheduleIdSelected(null);
  };

  const handleUpdateScheduleStatus = async (statusInfo: {
    id: string;
    status: Status;
  }) => {
    const { id } = statusInfo;

    setScheduleIdSelected(id);

    await updateScheduleStatus(statusInfo).unwrap();

    setScheduleIdSelected(null);
  };

  return (
    <List disablePadding>
      {teams &&
        listItems.map(
          ({
            id,
            date,
            status,
            teams: {
              home: { odds: homeOdds, teamId: homeTeamId },
              visitor: { odds: visitorOdds, teamId: visitorTeamId },
            },
          }: Schedule) => {
            const dayScheduled = new Date(date);

            const { name: homeName } = teams.find(
              ({ id }) => id === homeTeamId
            );

            const { name: visitorName } = teams.find(
              ({ id }) => id === visitorTeamId
            );

            const key = `${homeName}${visitorName}${dayScheduled}`;

            const Primary = ({ home, visitor }) => (
              <Stack>
                <span>{home}</span>
                <span>{visitor}</span>
              </Stack>
            );

            const Secondary = ({ schedule }) => (
              <>
                {format(
                  schedule,
                  isToday(schedule)
                    ? `'Today at' h:mm a`
                    : `EE MM/dd/yyyy 'at' h:mm a`
                )}
              </>
            );

            const isDisabled =
              (isScheduleDeleting || isScheduleUpdating) &&
              id === scheduleIdSelected;

            return (
              <ListItem
                disableGutters
                key={key}
                secondaryAction={
                  <SecondaryAction
                    handleDelete={handleDelete}
                    handleUpdateScheduleStatus={handleUpdateScheduleStatus}
                    id={id}
                    isDisabled={isDisabled}
                  />
                }
              >
                <ListItemAvatar>
                  {isDisabled ? (
                    <CircularProgress size="1rem" />
                  ) : (
                    <StatusIcon status={status} />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ variant: 'body2' }}
                  primary={<Primary home={homeName} visitor={visitorName} />}
                  secondary={<Secondary schedule={dayScheduled} />}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            );
          }
        )}
    </List>
  );
};

const SecondaryAction = ({
  handleDelete,
  handleUpdateScheduleStatus,
  id,
  isDisabled,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusClick = (statusInfo: { id: string; status: Status }) => {
    handleUpdateScheduleStatus(statusInfo);
    handleClose();
  };

  const menuItems = [
    {
      Icon: CheckCircleIcon,
      status: Status.Ended,
    },
    {
      Icon: CellTowerIcon,
      status: Status.Live,
    },
    {
      Icon: ScheduleIcon,
      status: Status.Soon,
    },
  ];

  return (
    <>
      <Stack direction="row">
        <IconButton disabled={isDisabled} onClick={handleClick}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton disabled={isDisabled} onClick={() => handleDelete(id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
      <StyledMenu
        id="status-menu"
        anchorEl={anchorEl}
        MenuListProps={{
          'aria-labelledby': 'status-menuItem-button',
        }}
        open={open}
        onClose={handleClose}
      >
        {menuItems.map(({ Icon, status }, index) => (
          <MenuItem
            key={index}
            onClick={() => handleStatusClick({ id, status })}
          >
            <Icon />
            Set as {status}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

export default Schedules;
