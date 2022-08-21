import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import SportsIcon from '../../components/SportsIcon';

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
    <Card sx={{ borderRadius: '2rem', boxShadow: 0 }}>
      <CardHeader
        action={
          <Link href={`/matches/${id}`}>
            <Button>Bet</Button>
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
    </Card>
  );
};

export default SchedulesCard;
