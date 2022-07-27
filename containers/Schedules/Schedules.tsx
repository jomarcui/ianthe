import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { add } from 'date-fns';

import FullWidthTabs from '../../components/FullWidthTabs';
import store from '../../redux/store';
import { setSchedule } from '../../redux/features/schedulesSlice';
import { useTeamsQuery } from '../../redux/api/teamsApi';
import { PhilippineSportsLeague } from '../../enums';

type Inputs = {
  home: string;
  leagueId: string,
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

const ScheduleForm = ({ leagueId, open = false, setOpen }) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      leagueId,
      home: '',
      date: null,
      time: null,
      visitor: '',
    },
  });
  const [errorDuplicateSchedule, setErrorDuplicateSchedule] = useState(null);
  const { data, error, isLoading, isSuccess } = useTeamsQuery();

  if (isLoading) return null;
  
  const teams = data.filter(({ league_id }) => league_id === leagueId + 1)

  const watchFields = watch(['home', 'visitor']);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleFormSubmit: SubmitHandler<Inputs> = async (formData) => {
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
        visitor === formData.visitor,
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

            <input
              id="text-leagues"
              type="hidden"
              {...register('leagueId', { required: true })}
            />

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
                {teams.map(({ _id, name }) => (
                  <MenuItem
                    disabled={_id === watchFields[1]}
                    key={_id}
                    value={_id}
                  >
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
                {teams.map(({ _id, name }) => (
                  <MenuItem
                    disabled={_id === watchFields[0]}
                    key={_id}
                    value={_id}
                  >
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
                  minDate={add(new Date(), {
                    days: 1,
                  })}
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

const Schedules = () => {
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = React.useState(PhilippineSportsLeague.PBA);
  
  const { data, error, isLoading, isSuccess } = useTeamsQuery();

  const schedules = store.getState().schedules.schedules;

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

  const handleChange = (event: React.SyntheticEvent, newValue: PhilippineSportsLeague) => {
    setSelectedLeague(newValue);
  };

  const handleScheduleFormOpen = () => setScheduleFormOpen(true);

  // const tabs = [
  //   {
  //     header: {
  //       key: PhilippineSportsLeague.PBA,
  //       label: PhilippineSportsLeague[PhilippineSportsLeague.PBA],
  //     },
  //     body: (
  //       <TableContainer component={Box}>
  //         <Table aria-label="Game Schedule">
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Teams</TableCell>
  //               <TableCell>Date</TableCell>
  //               <TableCell>Time</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {pbaSchedules.map(
  //               ({
  //                 home,
  //                 date,
  //                 time,
  //                 visitor,
  //               }: {
  //                 home: string;
  //                 date: Date;
  //                 time: Date;
  //                 visitor: string;
  //               }) => {
  //                 const { name: homeName } = data.find(
  //                   ({ _id }) => _id === home,
  //                 );
  //                 const { name: visitorName } = data.find(
  //                   ({ _id }) => _id === visitor,
  //                 );

  //                 const key = `${homeName}${visitorName}`;
  //                 const teams = `${homeName} vs ${visitorName}`;

  //                 return (
  //                   <TableRow key={key}>
  //                     <TableCell>{teams}</TableCell>
  //                     <TableCell>{date.toLocaleDateString()}</TableCell>
  //                     <TableCell>{time.toLocaleTimeString()}</TableCell>
  //                   </TableRow>
  //                 );
  //               },
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     ),
  //   }, {
  //     header: {
  //       key: PhilippineSportsLeague.PBL,
  //       label: PhilippineSportsLeague[PhilippineSportsLeague.PBL],
  //     },
  //     body: (
  //       <TableContainer component={Box}>
  //         <Table aria-label="Game Schedule">
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Teams</TableCell>
  //               <TableCell>Date</TableCell>
  //               <TableCell>Time</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {pblSchedules.map(
  //               ({
  //                 home,
  //                 date,
  //                 time,
  //                 visitor,
  //               }: {
  //                 home: string;
  //                 date: Date;
  //                 time: Date;
  //                 visitor: string;
  //               }) => {
  //                 const { name: homeName } = data.find(
  //                   ({ _id }) => _id === home,
  //                 );
  //                 const { name: visitorName } = data.find(
  //                   ({ _id }) => _id === visitor,
  //                 );

  //                 const key = `${homeName}${visitorName}`;
  //                 const teams = `${homeName} vs ${visitorName}`;

  //                 return (
  //                   <TableRow key={key}>
  //                     <TableCell>{teams}</TableCell>
  //                     <TableCell>{date.toLocaleDateString()}</TableCell>
  //                     <TableCell>{time.toLocaleTimeString()}</TableCell>
  //                   </TableRow>
  //                 );
  //               },
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     ),
  //   },{
  //     header: {
  //       key: PhilippineSportsLeague.PVL,
  //       label: PhilippineSportsLeague[PhilippineSportsLeague.PVL],
  //     },
  //     body: (
  //       <TableContainer component={Box}>
  //         <Table aria-label="Game Schedule">
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Teams</TableCell>
  //               <TableCell>Date</TableCell>
  //               <TableCell>Time</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {pvlSchedules.map(
  //               ({
  //                 home,
  //                 date,
  //                 time,
  //                 visitor,
  //               }: {
  //                 home: string;
  //                 date: Date;
  //                 time: Date;
  //                 visitor: string;
  //               }) => {
  //                 const { name: homeName } = data.find(
  //                   ({ _id }) => _id === home,
  //                 );
  //                 const { name: visitorName } = data.find(
  //                   ({ _id }) => _id === visitor,
  //                 );

  //                 const key = `${homeName}${visitorName}`;
  //                 const teams = `${homeName} vs ${visitorName}`;

  //                 return (
  //                   <TableRow key={key}>
  //                     <TableCell>{teams}</TableCell>
  //                     <TableCell>{date.toLocaleDateString()}</TableCell>
  //                     <TableCell>{time.toLocaleTimeString()}</TableCell>
  //                   </TableRow>
  //                 );
  //               },
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     ),
  //   }
  // ];

  const leaguesTabItems = [
    {
      key: PhilippineSportsLeague.PBA,
      label: PhilippineSportsLeague[PhilippineSportsLeague.PBA],
      value: PhilippineSportsLeague.PBA,
    },
    {
      key: PhilippineSportsLeague.PBL,
      label: PhilippineSportsLeague[PhilippineSportsLeague.PBL],
      value: PhilippineSportsLeague.PBL,
    },
    {
      key: PhilippineSportsLeague.PVL,
      label: PhilippineSportsLeague[PhilippineSportsLeague.PVL],
      value: PhilippineSportsLeague.PVL,
    },
  ];

  return (
    <>
      <Box>
        <Box sx={{ bgcolor: '#1976d2' }}>
          <Typography align="center" color="#fff" variant="h6">
            Game Schedule
          </Typography>
        </Box>
        <Tabs
          aria-label="secondary tabs example"
          indicatorColor="secondary"
          onChange={handleChange}
          textColor="secondary"
          value={selectedLeague}
          variant="fullWidth"
        >
          {leaguesTabItems.map(({ key, label, value }) => (
            <Tab key={key} label={label} value={value} />
          ))}
        </Tabs>
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
              {schedules.filter(({ leagueId }) => leagueId === selectedLeague)
              .map(
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
                }, index) => {
                  const { name: homeName } = data.find(
                    ({ _id }) => _id === home,
                  );
                  const { name: visitorName } = data.find(
                    ({ _id }) => _id === visitor,
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
                },
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
          // teams={data}
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

export default Schedules;
