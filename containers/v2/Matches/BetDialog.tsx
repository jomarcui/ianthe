import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  TextField,
  Typography,
  DialogActions,
  Button,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TransactionStatus, TransactionType } from '../../../enums';
import { getTotalNumberOfBetsByQuery } from '../../../helpers/transactionsHelper';
import { useCreateTransactionMutation, useGetTransactionByIdQuery } from '../../../redux/api/transactionsApi';

const getReturnPercentage = (odds: number) => (odds - 1) * 100;

const getReturn = ({
  amount = 0,
  odds = 0,
}: {
  amount: number;
  odds: number;
}) => {
  if (Number.isNaN(amount)) return 0;

  const returnsMultiplier = Number(odds) - 1;

  return Number(amount) * returnsMultiplier + Number(amount);
};

type BetDialogProps = {
  handleClose: () => void;
  isOpen: boolean;
  matchId: string;
  team: any;
  title: string;
};

type BetFormInput = {
  amount: number;
};

const BetDialog = ({
  handleClose,
  isOpen,
  matchId,
  team,
  title,
}: BetDialogProps) => {
  const { handleSubmit, register, setValue, watch } = useForm<BetFormInput>({
    defaultValues: {
      amount: 20,
    },
  });
  const { data: session } = useSession();
  const { data: getTransactionByIdData } = useGetTransactionByIdQuery(
    session?.user['id'],
    {
      skip: !session,
    }
  );
  const [createTransaction, { isLoading: isCreateTransactionLoading }] =
    useCreateTransactionMutation();

  useEffect(() => setValue('amount', 20), [setValue, team]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    event.target.select();

  const handleSigninClick = () => signIn();

  const onSubmit: SubmitHandler<BetFormInput> = async ({ amount }) => {
    const {
      team: { id: teamId },
    } = team;

    const payload = {
      amount,
      match: matchId,
      status: TransactionStatus.ACTIVE,
      team: teamId,
      type: TransactionType.BET,
      user: session?.user['id'],
    };

    await createTransaction(payload);

    handleClose();
  };

  const renderActionButton = () => {
    if (session) {
      return (
        <LoadingButton
          form="bet-form"
          loading={isCreateTransactionLoading}
          size="small"
          type="submit"
          variant="contained"
        >
          Place Bet
        </LoadingButton>
      )
    }

    return <Button onClick={handleSigninClick} size="small" variant="contained">Sign in</Button>
  }

  if (!team) return null;

  const { odds, team: { id: teamId } } = team;

  const watchAmount = Number(watch('amount'));

  const totalNumberOfBets = getTotalNumberOfBetsByQuery({ filterQuery: ({ match, team }) => match === matchId && team === teamId, transactions: getTransactionByIdData?.data.transactions });

  return (
    <Dialog fullWidth maxWidth="lg" onClose={handleClose} open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" id="bet-form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1}>
            <Box my={1}>
              <TextField
                placeholder="0.00"
                id="amount-text"
                inputProps={{ step: 0 }}
                label="Amount"
                name="amount"
                onFocus={handleFocus}
                required
                type="number"
                variant="outlined"
                {...register('amount')}
              />
            </Box>
            {totalNumberOfBets && (
              <Typography fontSize="small">You have a total of <strong>{totalNumberOfBets} bet(s)</strong> on this team.</Typography>
            )}
            <Stack justifyContent="space-between" direction="row" spacing={1}>
              <Typography fontSize="small">Odds</Typography>
              <Typography fontSize="small">{`${getReturnPercentage(
                odds
              )}%`}</Typography>
            </Stack>
            <Stack justifyContent="space-between" direction="row" spacing={1}>
              <Typography fontWeight={500}>Total Returns</Typography>
              <Typography fontWeight={500}>
                {getReturn({ odds, amount: watchAmount })}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" variant="outlined">
          Cancel
        </Button>
        {renderActionButton()}
      </DialogActions>
    </Dialog>
  );
};

export default BetDialog;
