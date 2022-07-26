import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import store from '../../../redux/store';
import { setSchedule } from '../../../redux/features/schedulesSlice';

type Inputs = {
  home: string;
  date: Date | null;
  time: Date | null;
  visitor: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ScheduleForm = ({ open = false, setOpen, teams = [] }) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      home: '',
      date: null,
      time: null,
      visitor: '',
    },
  });
  const [errorDuplicateSchedule, setErrorDuplicateSchedule] = useState(null);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (formData.home === formData.visitor) {
      setErrorDuplicateSchedule("Home and visitor teams can't be the same!");
      return;
    }

    const schedules = store.getState().schedules.schedules;

    const schedule = schedules.find(
      ({
        home,
        date,
        time,
        visitor,
      }: {
        home: string;
        date: Date;
        time: Date;
        visitor: string;
      }) =>
        home === formData.home &&
        date.toLocaleDateString() === formData.date.toLocaleDateString() &&
        time.toLocaleTimeString() === formData.time.toLocaleTimeString() &&
        visitor === formData.visitor
    );

    if (schedule) {
      setErrorDuplicateSchedule('This schedule already exists!');
      return;
    }

    store.dispatch(setSchedule(formData));
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>Add Game Schedule</DialogTitle>
        <DialogContent>
          <Stack
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            my={2}
            spacing={2}
          >
            {errorDuplicateSchedule && (
              <Alert severity="error" variant="filled">
                {errorDuplicateSchedule}
              </Alert>
            )}

            <FormControl
              error={errors.home?.type === 'required'}
              required
              fullWidth
            >
              <InputLabel id="select-home-label">Home</InputLabel>
              <Select
                id="select-home"
                label="Home"
                labelId="select-home-label"
                {...register('home', { required: true })}
              >
                {teams.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              error={errors.visitor?.type === 'required'}
              required
              fullWidth
            >
              <InputLabel id="select-visitor-label">Visitor</InputLabel>
              <Select
                id="select-visitor"
                label="Visitor"
                labelId="select-visitor-label"
                {...register('visitor', { required: true })}
              >
                {teams.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value, ref } }) => (
                <MobileDatePicker
                  inputFormat="MM/dd/yyyy"
                  inputRef={ref}
                  label="Date"
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} />}
                  value={value}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="time"
              render={({ field: { onChange, value, ref } }) => (
                <TimePicker
                  inputRef={ref}
                  label="Time"
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} />}
                  value={value}
                />
              )}
              rules={{ required: true }}
            />

            <Grid container>
              <Grid item xs>
                <Button
                  color="secondary"
                  onClick={handleClose}
                  variant="contained"
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

const Games = () => {
  const [gameScheduleFormOpen, setGameScheduleFormOpen] = useState(false);
  const [scheduleHasBeenAdded, setScheduleHasBeenAdded] = useState(false);

  useEffect(() => {
    return () => unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pbaTeams = [
    {
      id: 1,
      name: 'Barangay Ginebra San Miguel',
    },
    {
      id: 2,
      name: 'Blackwater Bossing',
    },
    {
      id: 3,
      name: 'Converge FiberXers',
    },
    {
      id: 4,
      name: 'Magnolia Hotshots',
    },
    {
      id: 5,
      name: 'Meralco Bolts',
    },
    {
      id: 6,
      name: 'NLEX Road Warriors',
    },
  ];

  const schedules = store.getState().schedules.schedules;

  const unsubscribe = store.subscribe(() => setScheduleHasBeenAdded(true));

  // const games = [
  //   {
  //     league: PhilippineSportsLeague.PBA,
  //     schedule: null,
  //     sport: Sport.BasketBall,
  //     teams: [
  //       {
  //         name: 'Barangay Ginebra San Miguel',
  //         src: null,
  //         team: Team.Home,
  //       },
  //       {
  //         name: 'Meralco Bolts',
  //         src: null,
  //         team: Team.Visitor,
  //       }
  //     ],
  //   },
  // ];

  const handleGameScheduleFormOpen = () => setGameScheduleFormOpen(true);

  return (
    <Box>
      <h2>Game Schedule</h2>
      <TableContainer component={Box}>
        <Table aria-label="Game Schedule">
          <TableHead>
            <TableRow>
              <TableCell>Teams</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map(
              ({
                home,
                date,
                time,
                visitor,
              }: {
                home: string;
                date: Date;
                time: Date;
                visitor: string;
              }) => {
                const { name: homeName } = pbaTeams.find(
                  ({ id }) => id === Number(home)
                );
                const { name: visitorName } = pbaTeams.find(
                  ({ id }) => id === Number(visitor)
                );

                const key = `${homeName}${visitorName}`;
                const teams = `${homeName} vs ${visitorName}`;

                return (
                  <TableRow key={key}>
                    <TableCell>{teams}</TableCell>
                    <TableCell>{date.toLocaleDateString()}</TableCell>
                    <TableCell>{time.toLocaleTimeString()}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box m={2} textAlign="end">
        <LoadingButton
          onClick={handleGameScheduleFormOpen}
          loading={false}
          variant="contained"
        >
          Add Schedule
        </LoadingButton>
      </Box>
      <ScheduleForm
        open={gameScheduleFormOpen}
        setOpen={setGameScheduleFormOpen}
        teams={pbaTeams}
      />
      <Snackbar
        autoHideDuration={6000}
        onClose={() => setScheduleHasBeenAdded(false)}
        open={scheduleHasBeenAdded}
      >
        <Alert
          onClose={() => setScheduleHasBeenAdded(false)}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          A schedule has been added!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Games;
