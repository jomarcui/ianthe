import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Stack,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useTeamsQuery } from '../../redux/api/teamsApi';
import { LoadingButton } from '@mui/lab';
import { useLeaguesQuery } from '../../redux/api/leaguesApi';
import { useAddScheduleMutation } from '../../redux/api/schedulesApi';
import { Status } from '../../enums';
import { League } from '../../types';
import Loader from '../../components/Loader/Loader';

type FormInputs = {
  date: Date | null;
  home: string;
  homeOdds: Number;
  visitor: string;
  visitorOdds: Number;
};

type GetLeagueNameById = {
  leagueId: string;
  leagues: League[];
};

type ScheduleFormProps = {
  league: League;
  open: boolean;
  setOpen: any;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getLeagueNameById = ({ leagues, leagueId }: GetLeagueNameById) =>
  leagues.find(({ id }) => id === leagueId).name;

const ScheduleForm = ({
  league: { id, sportId },
  open,
  setOpen,
}: ScheduleFormProps) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
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

  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();

  const [
    addSchedule,
    { error: addScheduleError, isLoading: isAddScheduleLoading },
  ] = useAddScheduleMutation();

  const ws = new WebSocket(process.env.NEXT_PUBLIC_HOST.replace(/^http/, 'ws')); //'ws://localhost:5000'

  ws.addEventListener('message', (event) => {
    console.log('Message from server', event.data);
  });

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
      leagueId: id,
      sportId: sportId,
      status: Status.Soon,
      teams: {
        home: { odds: homeOdds, teamId: home },
        visitor: { odds: visitorOdds, teamId: visitor },
      },
    };

    await addSchedule(newSchedule);

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
          {isLeaguesLoading && <Loader />}

          {leagues && (
            <DialogContentText variant="body2">
              {getLeagueNameById({ leagues, leagueId: id })}
            </DialogContentText>
          )}

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
                    <TeamsSelect
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
                variant="outlined"
                required
                type="number"
                inputProps={{
                  maxLength: 13,
                  step: 'any',
                }}
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
                    <TeamsSelect
                      field={field}
                      leagueId={id}
                      watchField={home}
                    />
                  )}
                />
              </FormControl>

              <TextField
                id="text-visitor-odds"
                label="Odds"
                variant="outlined"
                required
                type="number"
                inputProps={{
                  maxLength: 4,
                  step: 'any',
                }}
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

const TeamsSelect = ({ field, leagueId, watchField }) => {
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

  return (
    <Select {...field}>
      {isTeamsLoading && (
        <MenuItem>
          <Box width="100%">
            <Loader />
          </Box>
        </MenuItem>
      )}

      {teams &&
        teams
          .filter(({ leagueId: dataLeagueId }) => dataLeagueId === leagueId)
          .map(({ id, name }) => (
            <MenuItem disabled={id === watchField} key={id} value={id}>
              {name}
            </MenuItem>
          ))}
    </Select>
  );
};

export default ScheduleForm;
