import { format } from 'date-fns';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import SportsIcon from '../../components/SportsIcon';
import { RoundedButton } from '../../styledComponents/Buttons';
import { RoundedCard } from '../../styledComponents/Cards';

type SchedulesCardProps = {
  schedule: any;
};

const SchedulesCard = ({
  schedule: {
    date,
    id,
    league: { sportId },
    status,
    teams,
  },
}: SchedulesCardProps) => {
  const {
    team: { name: teamNameHome },
    odds: oddsHome,
  } = teams.find(({ isHome }) => isHome);

  const {
    team: { name: teamVisitorName },
    odds: oddsVisitor,
  } = teams.find(({ isHome }) => !isHome);

  return (
    <RoundedCard>
      <CardHeader
        action={
          <Link href={`/matches/${id}`}>
            <RoundedButton>Bet</RoundedButton>
          </Link>
        }
        avatar={<SportsIcon sportId={sportId} status={status} />}
        subheader={format(new Date(date), 'h:mm a')}
      />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography align="center">{teamNameHome}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="center">{teamVisitorName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <Chip label={oddsHome.toString()} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <Chip label={oddsVisitor.toString()} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </RoundedCard>
  );
};

export default SchedulesCard;
