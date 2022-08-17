import { useEffect, useState } from 'react';
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
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Box,
} from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGetTeamByIdQuery } from '../../redux/api/teamsApi';
import PleaseSignIn from '../../components/PleaseSignIn';
import Transition from '../../components/Transition';
import { useGetMatchByIdQuery } from '../../redux/api/matchesApi';

enum Operation {
  Add,
  Subtract,
}

type BetFormProps = {
  handleClose: () => void;
  matchId: string;
  open: boolean;
  selectedTeamId: string;
}

type FormInput = {
  bet: string;
};

const computeTotalReturn = ({
  bet,
  odds,
}: {
  bet: number;
  odds: number;
}): number => bet + bet / odds;

const BetForm = ({ handleClose, matchId, open, selectedTeamId }: BetFormProps) => {
  const [totalReturn, setTotalReturn] = useState(0);
  const { data: session, status } = useSession();
  const { data: match, isLoading: isMatchLoading } = useGetMatchByIdQuery(matchId);

  const selectedTeam = match?.teams.find(({ id }) => id === selectedTeamId);

  const { handleSubmit, register, setValue, watch } = useForm<FormInput>({
    defaultValues: {
      bet: '20.00',
    },
  });

  useEffect(() => {
    if (!selectedTeam) return;

    setTotalReturn(computeTotalReturn({ bet: 20, odds: selectedTeam.odds }));
  }, [selectedTeam]);

  const watchBet = Number(watch('bet'));

  const handleBetChange = ({ operation }: { operation: Operation }) => {
    const bet =
      operation === Operation.Subtract ? watchBet - 10 : watchBet + 10;

    setValue('bet', bet.toFixed(2).toString());
    setTotalReturn(computeTotalReturn({ bet, odds: selectedTeam.odds }));
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
      <DialogContent>
        {status === 'unauthenticated' && <PleaseSignIn />}

        {status === 'authenticated' && (
          <Stack spacing={5}>
            <Card variant="outlined">
              <CardHeader
                avatar={<InfoIcon color="info" />}
                subheader="Add credits by sending GCash to 09XX-XXX-XXXX"
              />
              <CardContent>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>My Credits</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">Php0.00</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Stack spacing={2}>
              <Typography variant="h6">Bet on</Typography>
              <Typography>
                {`${selectedTeam?.name} @${selectedTeam?.odds}`}
              </Typography>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Stack spacing={2}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Stack
                        direction="row"
                        sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
                      >
                        <button
                          onClick={() =>
                            handleBetChange({ operation: Operation.Subtract })
                          }
                          style={{
                            border: 'none',
                            fontSize: '1rem',
                            width: '6rem',
                          }}
                        >
                          <Typography>-</Typography>
                        </button>
                        <input
                          step="any"
                          type="number"
                          style={{
                            border: 'none',
                            borderRadius: 0,
                            fontSize: '1rem',
                            padding: '0.875rem',
                            width: '100%',
                          }}
                          {...register('bet')}
                        ></input>
                        <button
                          onClick={() =>
                            handleBetChange({ operation: Operation.Add })
                          }
                          style={{
                            border: 'none',
                            fontSize: '1rem',
                            width: '6rem',
                          }}
                        >
                          <Typography>+</Typography>
                        </button>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack>
                        <Typography align="right">Return</Typography>
                        <Typography align="right">
                          <strong>{totalReturn.toFixed(2)}</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <LoadingButton fullWidth onClick={() => alert('Soon!')} variant="contained">
                    Place bet
                  </LoadingButton>
                  <Button fullWidth onClick={handleClose} variant="outlined">
                    Cancel
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BetForm;
