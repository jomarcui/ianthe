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
  ListItemAvatar,
  Alert,
  Stack,
  Typography,
  AlertTitle,
} from '@mui/material';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useGetTransactionByIdQuery } from '../../../redux/api/transactionsApi';
import * as Styled from './Matches.styles';

const getReturnPercentage = (odds: number) => (odds - 1) * 100;

const getReturn = ({ amount, returnPercentage }): Number =>
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

  const totalAmount: Number = transactionsByMatchIdAndTeamId?.reduce(
    (result: any, { amount }: any) => result + amount,
    0
  );

  return (
    <Card>
      <CardHeader
        action={
          <Button
            disabled={betDisabled || !totalAmount}
            onClick={handleClick}
            size="small"
            value={teamId}
            variant="contained"
          >
            {!!totalAmount ? 'Bet' : 'Closed'}
          </Button>
        }
        avatar={
          <Avatar>{`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`}</Avatar>
        }
        subheader={`Return ${getReturnPercentage(odds)}%`}
        title={name}
      />

      {!!totalAmount && (
        <CardContent>
          <Styled.PossibleReturnAmount>
            <Typography sx={{ color: '#fff' }}>
              <>Potential Winnings from your &#8369;{totalAmount.toFixed(2)}</>
            </Typography>
            <Typography
              fontSize="2rem"
              fontWeight={700}
              textAlign="right"
              sx={{ color: '#fff' }}
            >
              &#8369;
              {getReturn({
                amount: totalAmount,
                returnPercentage: getReturnPercentage(odds),
              }).toFixed(2)}
            </Typography>
          </Styled.PossibleReturnAmount>
        </CardContent>
      )}
    </Card>
  );
};

export default BetCard;
