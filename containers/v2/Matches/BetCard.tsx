import { Paid as PaidIcon } from '@mui/icons-material';
import {
  Card,
  CardHeader,
  Button,
  Avatar,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemAvatar,
  Alert,
  Stack,
  Typography,
  AlertTitle,
} from '@mui/material';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useGetTransactionByIdQuery } from '../../../redux/api/transactionsApi';

const getReturnPercentage = (odds: number) => (odds - 1) * 100;

const getReturn = ({ amount, returnPercentage }) =>
  amount + amount * (returnPercentage / 100);

type BetCardProps = {
  betDisabled: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  matchId: string;
  team: any;
};

const BetCard = ({ betDisabled, handleClick, matchId, team }: BetCardProps) => {
  const { data: session } = useSession();
  const { data: getTransactionByIdData } = useGetTransactionByIdQuery(
    session?.user['id'],
    {
      skip: !session,
    }
  );

  if (!team) return null;

  const {
    odds,
    team: { id: teamId, name },
  } = team;

  const transactionsByMatchIdAndTeamId =
    getTransactionByIdData?.data.transactions
      .filter(({ match, team }) => match === matchId && team === teamId)
      .map(({ amount, createdAt }) => ({ amount, createdAt }));

  const totalAmount = transactionsByMatchIdAndTeamId.reduce(
    (result, { amount }) => result + amount,
    0
  );

  return (
    <Card>
      <CardHeader
        action={
          <Button
            disabled={betDisabled}
            onClick={handleClick}
            size="small"
            value={teamId}
            variant="contained"
          >
            Bet
          </Button>
        }
        avatar={
          <Avatar>{`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`}</Avatar>
        }
        subheader={`Return ${getReturnPercentage(odds)}%`}
        title={name}
      />

      {!!transactionsByMatchIdAndTeamId.length && (
        <CardContent>
          <Stack spacing={3}>
            {totalAmount && (
              <Alert severity="info">
                <AlertTitle>Win</AlertTitle>
                <Typography fontSize="2rem" fontWeight={700}>
                  &#8369;
                  {getReturn({
                    amount: totalAmount,
                    returnPercentage: getReturnPercentage(odds),
                  }).toFixed(2)}
                </Typography>
              </Alert>
            )}

            <List disablePadding>
              {transactionsByMatchIdAndTeamId.map(
                ({ amount, createdAt }, index) => (
                  <ListItem disableGutters disablePadding key={index}>
                    <ListItemAvatar sx={{ textAlign: 'center' }}>
                      <PaidIcon fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`₱${amount.toFixed(2)}`}
                      secondary={format(
                        new Date(createdAt),
                        `EE MM/dd/yyyy 'at' h:mm a`
                      )}
                    />
                  </ListItem>
                )
              )}
            </List>
          </Stack>
        </CardContent>
      )}
    </Card>
  );
};

export default BetCard;
