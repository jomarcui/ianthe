import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LoadingButton } from '@mui/lab';
import { useCreateMatchMutation } from '../../redux/api/matchesApi';
import { Status } from '../../enums';
import { League } from '../../types';
import Loader from '../../components/Loader';
import Transition from '../../components/Transition';
import TeamSelect from './TeamSelect';

type FormInputs = {
  date: Date | null;
  home: string;
  homeOdds: Number;
  visitor: string;
  visitorOdds: Number;
};

type ScheduleFormProps = {
  league: League;
  open: boolean;
  setOpen: any;
};

const ScheduleForm = ({
  league: { id, name },
  open,
  setOpen,
}: ScheduleFormProps) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      date: null,
      home: '',
      homeOdds: 0,
      visitor: '',
      visitorOdds: 0,
    },
  });

  const [error, setError] = useState(null);

  const [
    createMatch,
    { error: addScheduleError, isLoading: isAddScheduleLoading },
  ] = useCreateMatchMutation();

  useEffect(() => {
    if (addScheduleError) setError(addScheduleError['data']);
  }, [addScheduleError]);

  const [home, visitor] = watch(['home', 'visitor']);

  const handleClose = () => {
    reset();
    setError(null);
    setOpen(false);
  };

  const handleFormSubmit: SubmitHandler<FormInputs> = async (formData) => {
    const { date, home, homeOdds, visitor, visitorOdds } = formData;

    const newSchedule = {
      date,
      league: id,
      status: Status.Soon,
      teams: [
        {
          odds: homeOdds,
          isHome: true,
          team: home,
        },
        { odds: visitorOdds, isHome: false, team: visitor },
      ],
    };

    await createMatch(newSchedule);

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
        <DialogTitle>Add Schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>{name}</DialogContentText>
          <Stack
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            my={2}
            spacing={2}
          >
            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={2}>
              <FormControl
                error={errors.home?.type === 'required'}
                fullWidth
                required
              >
                <InputLabel id="select-home-label">Home</InputLabel>
                <Controller
                  control={control}
                  name="home"
                  render={({ field }) => (
                    <TeamSelect
                      field={field}
                      leagueId={id}
                      watchField={visitor}
                    />
                  )}
                />
              </FormControl>

              <TextField
                id="text-home-odds"
                label="Odds"
                inputProps={{
                  maxLength: 13,
                  step: 'any',
                }}
                onFocus={(e) => e.target.select()}
                required
                type="number"
                variant="outlined"
                {...register('homeOdds')}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <FormControl
                error={errors.visitor?.type === 'required'}
                fullWidth
                required
              >
                <InputLabel id="select-visitor-label">Visitor</InputLabel>
                <Controller
                  control={control}
                  name="visitor"
                  render={({ field }) => (
                    <TeamSelect field={field} leagueId={id} watchField={home} />
                  )}
                />
              </FormControl>

              <TextField
                id="text-visitor-odds"
                label="Odds"
                inputProps={{
                  maxLength: 4,
                  step: 'any',
                }}
                onFocus={(e) => e.target.select()}
                required
                type="number"
                variant="outlined"
                {...register('visitorOdds')}
              />
            </Stack>

            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value, ref } }) => (
                <MobileDatePicker
                  inputFormat="MM/dd/yyyy"
                  inputRef={ref}
                  label="Date"
                  minDate={new Date()}
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} />}
                  value={value}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              control={control}
              name="date"
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
                <LoadingButton
                  loading={isAddScheduleLoading}
                  type="submit"
                  variant="contained"
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ScheduleForm;
