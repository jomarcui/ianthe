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
  useUpdateScheduleStatusMutation,
} from '../../redux/api/schedulesApi';
import ScheduleForm from './ScheduleForm';
import { useSportsQuery } from '../../redux/api/sportsApi';
import { Status } from '../../enums';
import { Schedule } from '../../types';

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

const getStatusIcon = (status : Status) => {
  console.log(status)
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
  const [scheduleIdSelected, setScheduleIdSelected] = useState(null);

  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

  const [
    deleteSchedule,
    { isLoading: isScheduleDeleting, isSuccess: isScheduleDeleted },
  ] = useDeleteScheduleMutation();

  const [updateScheduleStatus, { isLoading: isUpdateScheduleStatusLoading }] =
    useUpdateScheduleStatusMutation();

  if (isTeamsLoading) return null;

  const handleDelete = async (id: string) => {
    setScheduleIdSelected(id);

    await deleteSchedule(id).unwrap();

    setScheduleIdSelected(null);
  };

  const handleUpdateScheduleStatus = async (statusInfo: { id: string, status: Status }) => {
    const { id } = statusInfo;
    
    setScheduleIdSelected(id);

    await updateScheduleStatus(statusInfo).unwrap();

    setScheduleIdSelected(null);
  }

  return (
    <List disablePadding>
      {body.map(
        ({
          _id,
          date,
          status,
          teams: { home, visitor },
        }: Schedule) => {
          const dayScheduled = new Date(date);
          const { name: homeName } = teams.find(({ _id }) => _id === home);
          const { name: visitorName } = teams.find(
            ({ _id }) => _id === visitor
          );
          
          const key = `${homeName}${visitorName}${dayScheduled}`;
          
          const Primary = ({ home, visitor }) => (
            <Stack>
              <Typography variant="caption">{home}</Typography>
              <Typography variant="caption">{visitor}</Typography>
            </Stack>
          );
          
          const StatusIcon = ({ status }) => getStatusIcon(status);

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

          const SecondaryAction = ({
            handleDelete,
            handleUpdateScheduleStatus,
            id,
            isDisabled,
          }) => {
            const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

            const open = Boolean(anchorEl);

            const handleClick = (
              event: React.MouseEvent<HTMLButtonElement>,
            ) => {
              setAnchorEl(event.currentTarget);
            };

            const handleClose = () => {
              setAnchorEl(null);
            };

            const handleStatusClick = (statusInfo: {
              id: string;
              status: Status;
            }) => {
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
                  <IconButton onClick={handleClick}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    disabled={isDisabled}
                    onClick={() => handleDelete(id)}
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

          const isDisabled =
            (isScheduleDeleting || isScheduleDeleted) &&
            _id === scheduleIdSelected;

          return (
            <ListItem
              key={key}
              secondaryAction={
                <SecondaryAction
                  handleDelete={handleDelete}
                  handleUpdateScheduleStatus={handleUpdateScheduleStatus}
                  id={_id}
                  isDisabled={isDisabled}
                />
              }
            >
              <ListItemAvatar>
                <StatusIcon status={status} />
              </ListItemAvatar>
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
