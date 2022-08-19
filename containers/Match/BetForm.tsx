import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
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
  Alert,
} from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGetMatchByIdQuery } from '../../redux/api/matchesApi';
import {
  useCreateTransactionMutation,
  useGetTransactionByIdQuery,
} from '../../redux/api/transactionsApi';
import PleaseSignIn from '../../components/PleaseSignIn';
import Transition from '../../components/Transition';
import { TransactionType } from '../../enums';

enum Operation {
  Add,
  Subtract,
}

type BetFormProps = {
  handleClose: () => void;
  matchId: string;
  open: boolean;
  selectedTeamId: string;
};

type FormInput = {
  amount: number;
  type: string;
  user: string;
};

const computeTotalReturn = ({
  amount,
  odds,
}: {
  amount: number;
  odds: number;
}): number => amount + amount / odds;

const BetForm = ({
  handleClose,
  matchId,
  open,
  selectedTeamId,
}: BetFormProps) => {
  const [totalReturn, setTotalReturn] = useState(0);
  const { data: session, status: sessionStatus } = useSession();
  const { data: match } = useGetMatchByIdQuery(matchId);

  const [createTransaction] = useCreateTransactionMutation();

  const { data: getTransactionByIdResponse } = useGetTransactionByIdQuery(
    (() => {
      if (!session) return null;

      return session.user['id'];
    })(),
    {
      skip: !session,
    }
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<FormInput>({
    defaultValues: {
      amount: 20,
      type: TransactionType.DEBIT,
      user: session?.user['id'],
    },
  });

  useEffect(() => {
    if (!selectedTeamId) return;

    const teamFound = match?.teams.find(({ id }) => id === selectedTeamId);

    setTotalReturn(
      computeTotalReturn({ amount: 20, odds: teamFound.odds || 0 })
    );
  }, [match?.teams, selectedTeamId]);

  const watchAmount = Number(watch('amount'));

  const handleBetChange = ({ operation }: { operation: Operation }) => {
    const amount =
      operation === Operation.Subtract ? watchAmount - 10 : watchAmount + 10;

    setValue('amount', amount);
    setTotalReturn(computeTotalReturn({ amount, odds: selectedTeam.odds }));
  };

  const handleFormSubmit: SubmitHandler<FormInput> = async (formData) => {
    const { amount: amountFormData, type } = formData;

    const amount =
      type === TransactionType.CREDIT
        ? Math.abs(amountFormData)
        : -Math.abs(amountFormData);

    const payload = {
      ...formData,
      amount,
    };

    await createTransaction(payload);

    handleClose();
  };

  const selectedTeam = match?.teams.find(({ id }) => id === selectedTeamId);

  const credits = getTransactionByIdResponse?.data.transactions.reduce(
    (prevValue: number, { amount }) => prevValue + amount,
    0
  );

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
        {sessionStatus === 'unauthenticated' && <PleaseSignIn />}

        {sessionStatus === 'authenticated' && (
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
                    <Typography align="right">&#8369;{credits}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Stack spacing={2}>
              <Typography variant="h6">Bet on</Typography>
              <Typography>
                {`${selectedTeam?.name} @${selectedTeam?.odds}`}
              </Typography>
              <form id="bet-form" onSubmit={handleSubmit(handleFormSubmit)}>
                <input type="hidden" {...register('type')} />
                <input type="hidden" {...register('user')} />
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
                          type="button"
                        >
                          <Typography>-</Typography>
                        </button>
                        <input
                          onFocus={(event) => event.target.select()}
                          required
                          step="any"
                          style={{
                            border: 'none',
                            borderRadius: 0,
                            fontSize: '1rem',
                            padding: '0.875rem',
                            width: '100%',
                          }}
                          type="number"
                          {...register('amount', {
                            validate: {
                              lessThanCredits: (value) =>
                                value < credits || 'insufficient credits',
                              greaterThanZero: (value) =>
                                value > 0 || 'must be greater than 0',
                            },
                          })}
                        />
                        <button
                          onClick={() =>
                            handleBetChange({ operation: Operation.Add })
                          }
                          style={{
                            border: 'none',
                            fontSize: '1rem',
                            width: '6rem',
                          }}
                          type="button"
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
                  {errors.amount && (
                    <Alert severity="warning">
                      <Typography>{errors.amount.message}</Typography>
                    </Alert>
                  )}
                  <LoadingButton fullWidth type="submit" variant="contained">
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
