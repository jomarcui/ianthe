import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
  TextField,
  Grid,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  DialogContent,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGetTeamByIdQuery } from '../../redux/api/teamsApi';
import PleaseSignIn from '../../components/PleaseSignIn';
import Transition from '../../components/Transition';

enum Operation {
  Add,
  Subtract,
}

type FormInput = {
  bet: number;
};

const BetForm = ({ handleClose, open, selectedTeamId }) => {
  const [skipGetTeamByIdQuery, setSkipGetTeamByIdQuery] = useState(true);
  const { data: session, status } = useSession();

  const { data: teamResponse, isLoading: isTeamLoading } = useGetTeamByIdQuery(
    selectedTeamId,
    { skip: skipGetTeamByIdQuery },
  );

  useEffect(() => {
    if (!selectedTeamId) return;

    setSkipGetTeamByIdQuery(false);
  }, [selectedTeamId, setSkipGetTeamByIdQuery]);

  const { handleSubmit, register, setValue, watch } = useForm<FormInput>({
    defaultValues: {
      bet: 20.0,
    },
  });

  const watchBet = watch('bet');

  const generateDialogContent = () => {
    if (status === 'unauthenticated') return <PleaseSignIn />;

    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <Stack direction="row">
            <Button
              onClick={() => handleBetChange({ operation: Operation.Subtract })}
              variant="outlined"
            >
              -
            </Button>
            <TextField
              autoFocus
              id="bet"
              inputProps={{
                step: 'any',
              }}
              required
              type="number"
              variant="outlined"
              sx={{ width: 100 }}
              {...register('bet')}
            />
            <Button
              onClick={() => handleBetChange({ operation: Operation.Add })}
              variant="outlined"
            >
              +
            </Button>
          </Stack>
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Button
                color="secondary"
                onClick={handleClose}
                variant="contained"
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton type="submit" variant="contained">
                Place bet
              </LoadingButton>
            </Grid>
          </Grid>
        </Stack>
      </form>
    );
  };

  const handleBetChange = ({ operation }: { operation: Operation }) => {
    const result =
      operation === Operation.Subtract ? watchBet - 10 : watchBet + 10;

    setValue('bet', result);
  };

  const handleFormSubmit: SubmitHandler<FormInput> = async (formData) => {
    console.log(formData);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            aria-label="close"
            color="inherit"
            edge="start"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Bet
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>{generateDialogContent()}</DialogContent>
    </Dialog>
  );
};

export default BetForm;
