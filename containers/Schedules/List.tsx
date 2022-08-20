import { useState } from 'react';
import { format, isToday } from 'date-fns';
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LiveTv as LiveTvIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import {
  useDeleteScheduleByLeagueIdMutation,
  useUpdateScheduleStatusByLeagueIdMutation,
} from '../../redux/api/schedulesApi';
import { Status } from '../../enums';

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
      return <LiveTvIcon color="error" titleAccess="Live" />;

    case Status.Soon:
      return <ScheduleIcon color="info" titleAccess="Happening soon" />;
  }
};

const List = ({ listItems = [] }) => {
  const [scheduleIdSelected, setScheduleIdSelected] = useState(null);

  const [
    deleteScheduleByLeagueId,
    { isLoading: isDeleteScheduleByLeagueIdLoading },
  ] = useDeleteScheduleByLeagueIdMutation();

  const [
    updateScheduleStatusByLeagueId,
    { isLoading: isUpdateScheduleStatusByLeagueIdLoading },
  ] = useUpdateScheduleStatusByLeagueIdMutation();

  const handleDelete = async (id: string) => {
    setScheduleIdSelected(id);

    await deleteScheduleByLeagueId(id);

    setScheduleIdSelected(null);
  };

  const handleUpdateScheduleStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: Status;
  }) => {
    setScheduleIdSelected(id);

    await updateScheduleStatusByLeagueId({ id, payload: { status } });

    setScheduleIdSelected(null);
  };

  const renderSchedule = (schedule: Date) =>
    format(
      schedule,
      isToday(schedule) ? `'Today at' h:mm a` : `EE MM/dd/yyyy 'at' h:mm a`
    );

  return (
    <Stack spacing={2}>
      {listItems.map(({ id, date, status, teams }) => {
        const schedule = new Date(date);

        const isDisabled =
          (isDeleteScheduleByLeagueIdLoading ||
            isUpdateScheduleStatusByLeagueIdLoading) &&
          id === scheduleIdSelected;

        return (
          <Card key={id} sx={{ position: 'relative' }}>
            <CardHeader
              action={
                <CardHeaderAction
                  handleDelete={handleDelete}
                  handleUpdateScheduleStatus={handleUpdateScheduleStatus}
                  id={id}
                  isDisabled={isDisabled}
                />
              }
              avatar={<StatusIcon status={status} />}
              subheader={renderSchedule(schedule)}
            />
            <CardContent>
              {teams.map(({ odds, team: { name } }) => (
                <Grid container key={name}>
                  <Grid item xs>
                    <Typography>{name}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography textAlign="right">{odds}</Typography>
                  </Grid>
                </Grid>
              ))}
            </CardContent>
            <Box
              bgcolor="rgba(255, 255, 255, 0.8)"
              alignItems="center"
              display={isDisabled ? 'flex' : 'none'}
              height="100%"
              justifyContent="center"
              left={0}
              position="absolute"
              top={0}
              width="100%"
            >
              <CircularProgress />
            </Box>
          </Card>
        );
      })}
    </Stack>
  );
};

const CardHeaderAction = ({
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
      Icon: LiveTvIcon,
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
          <EditIcon />
        </IconButton>
        <IconButton disabled={isDisabled} onClick={() => handleDelete(id)}>
          <DeleteIcon />
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

export default List;
