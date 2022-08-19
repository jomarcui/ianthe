import { SyntheticEvent, useState } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';
import { Schedule, Team } from '../../types';
import Link from 'next/link';
import teamsUtils from '../../utilities/teamsUtils';

import {
  StyledTeamNameContainer,
  StyledOdds,
} from './SchedulesListItem.styles';

type SchedulesListItemProps = {
  isLoading: boolean;
  schedule: Schedule;
  teams: Team[];
};

const BodyText = ({ children }) => (
  <Typography align="center" variant="body2">
    {children}
  </Typography>
);

const Loader = ({ Text }: { Text?: React.ReactNode }) => (
  <Stack direction="row" spacing={1}>
    <CircularProgress size="1rem" />
    {Text && Text}
  </Stack>
);

const SchedulesListItem = ({
  isLoading,
  schedule: {
    id,
    date,
    sportId,
    status,
    teams: {
      home: { odds: homeOdds, teamId: homeTeamId },
      visitor: { odds: visitorOdds, teamId: visitorTeamId },
    },
  },
  teams,
}: SchedulesListItemProps) => {
  if (isLoading) return <Loader />;

  const { name: homeName } = teamsUtils(teams).findById(homeTeamId);
  const { name: visitorName } = teamsUtils(teams).findById(visitorTeamId);

  return (
    <Box>
      <Card>
        <CardHeader
          action={
            <Link href={`/match/${id}`}>
              <Button>Bet</Button>
            </Link>
          }
          avatar={<ScheduleIcon color="info" />}
          subheader={format(new Date(date), 'h:mm a')}
        />
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography align="center">{homeName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="center">{visitorName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="center">
                <Chip label={homeOdds.toString()} />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="center">
                <Chip label={visitorOdds.toString()} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
    // <StyledListItemButton divider>
    //   <StyledListItemText primary={primary} />
    // </StyledListItemButton>
  );
};

export default SchedulesListItem;
