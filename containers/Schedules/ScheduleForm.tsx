import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
  Slide,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { add } from 'date-fns';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useTeamsQuery } from '../../redux/api/teamsApi';
import { setSchedule } from '../../redux/features/schedulesSlice';
import store from '../../redux/store';

type FormInputs = {
  home: string;
  leagueId: string;
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
  } = useForm<FormInputs>({
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

  const teams = data.filter(
    ({ leagueId: dataLeagueId }) => dataLeagueId === leagueId
  );

  const watchFields = watch(['home', 'visitor']);

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleFormSubmit: SubmitHandler<FormInputs> = async (formData) => {
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
    console.log('formData', formData);
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
              <Controller
                control={control}
                name="home"
                render={({ field }) => (
                  <Select {...field}>
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
                )}
              />
            </FormControl>

            <FormControl
              error={errors.visitor?.type === 'required'}
              required
              fullWidth
            >
              <InputLabel id="select-visitor-label">Visitor</InputLabel>
              <Controller
                control={control}
                name="visitor"
                render={({ field }) => (
                  <Select {...field}>
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
                )}
              />
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </LocalizationProvider>
  );
};

export default ScheduleForm;
