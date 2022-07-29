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
  ListItemAvatar,
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
} from '../../redux/api/schedulesApi';
import ScheduleForm from './ScheduleForm';
import { useSportsQuery } from '../../redux/api/sportsApi';

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
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
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
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const getStatusIcon = (dayScheduled: Date) => {
  const result = compareAsc(dayScheduled, new Date());

  switch (result) {
    case -1:
      return <DoneIcon color="disabled" titleAccess="Event finished" />;

    case 0:
      return <CellTowerIcon color="success" titleAccess="Live" />;

    case 1:
      return <ScheduleIcon color="info" titleAccess="Happening soon" />;
  }
};

const Schedules = () => {
  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();
  const { data: schedules, isLoading: isSchedulesLoading } =
    useSchedulesQuery();
    const { data: sports, isLoading: isSportsLoading } = useSportsQuery();
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<string>(
    '62e14be33b17ae7b977921e9'
  );
  const [selectedSportId, setSelectedSportId] = useState('62e14b643b17ae7b977921e8')

  useEffect(() => {
    if (isLeaguesLoading) return;

    setSelectedLeague(leagues[0]['_id']);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagues]);

  const isLoading =
    isLeaguesLoading || isSchedulesLoading || isSportsLoading || isTeamsLoading;

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const schedulesFiltered = schedules.filter(
    ({ leagueId }) => leagueId === selectedLeague
  );
  const tableHeaders = ['Status', 'Teams', 'Date', 'Time', 'Actions'];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedLeague(newValue);
    
    const { sportId } = teams.find(({ leagueId }) => leagueId === newValue)
    const { _id : id } = sports.find(({ _id }) => _id === sportId);
    
    setSelectedSportId(id);
  }

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
        <SchedulesList
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
          sportId={selectedSportId}
        />
      </Box>
    </>
  );
};

const SchedulesList = ({ data: { headers = [], body = [] } }) => {
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();
  const [
    deleteSchedule,
    { isLoading: isScheduleDeleting, isSuccess: isScheduleDeleted },
  ] = useDeleteScheduleMutation();
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    if (idToDelete) {
      handleDelete(idToDelete);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToDelete]);

  if (isTeamsLoading) return null;

  const handleDelete = async (id: string) => {
    await deleteSchedule(id).unwrap();

    setIdToDelete(null);
  };

  return (
    <List disablePadding>
      {body.map(
        ({
          _id,
          date,
          teams: { home, visitor },
        }: {
          _id: string;
          date: Date;
          teams: { home: string; visitor: string };
        }) => {
          const dayScheduled = new Date(date);
          const { name: homeName } = teams.find(({ _id }) => _id === home);
          const { name: visitorName } = teams.find(
            ({ _id }) => _id === visitor
          );
          
          const key = `${homeName}${visitorName}${dayScheduled}`;
          const statusIcon = getStatusIcon(dayScheduled);

          const Primary = ({ home, visitor }) => (
            <Stack>
              <Typography variant="caption">{home}</Typography>
              <Typography variant="caption">{visitor}</Typography>
            </Stack>
          );

          const Secondary = ({ schedule }) => (
            <Typography
              variant="caption"
            >
              {format(
                schedule,
                isToday(schedule)
                  ? `'Today at' h:mm a`
                  : `EE MM/dd/yyyy 'at' h:mm a`
              )}
            </Typography>
          )

          const SecondaryAction = ({ id, isDisabled }) => {
            const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

            const open = Boolean(anchorEl);

            const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              setAnchorEl(event.currentTarget);
            };
            const handleClose = () => {
              setAnchorEl(null);
            };
            
            return (
              <>
                <Stack direction="row">
                  <IconButton onClick={handleClick}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    disabled={isDisabled}
                    onClick={() => setIdToDelete(id)}
                  >
                    {isDisabled ? (
                      <CircularProgress size="1rem" />
                    ) : (
                      <DeleteIcon fontSize="small" />
                    )}
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
                  <MenuItem onClick={handleClose}>
                    <CheckCircleIcon />
                    Set as Ended
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <CellTowerIcon color="primary" />
                    Set as Live
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ScheduleIcon />
                    Set as Soon
                  </MenuItem>
                </StyledMenu>
              </>
            );
          };

          const isDisabled =
            (isScheduleDeleting || isScheduleDeleted) && _id === idToDelete;

          return (
            <ListItem
              key={key}
              secondaryAction={
                <SecondaryAction id={_id} isDisabled={isDisabled} />
              }
            >
              <ListItemAvatar>{statusIcon}</ListItemAvatar>
              <ListItemText
                primary={<Primary home={homeName} visitor={visitorName} />}
                secondary={<Secondary schedule={dayScheduled} />}
              />
            </ListItem>
          );
        }
      )}
    </List>
  );
};

export default Schedules;
