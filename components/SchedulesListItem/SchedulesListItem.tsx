import {
  Box,
  CircularProgress,
  Grid,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';
import { Schedule, Team } from '../../types';
import teamsUtils from '../../utilities/teamsUtils';
import ListItemAvatar from '../ListItemAvatar';
import SportsIcon from '../SportsIcon';
import {
  StyledTeamNameContainer,
  StyledOdds,
  StyledListItemButton,
  StyledListItemText,
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
  if (isLoading) {
    return (
      <ListItem>
        <Loader />
      </ListItem>
    );
  }

  const { name: homeName } = teamsUtils(teams).findById(homeTeamId);
  const { name: visitorName } = teamsUtils(teams).findById(visitorTeamId);

  const primary = (
    <Link href={`/match/${id}`}>
      <a>
        <Grid container rowSpacing="0.125rem">
          <Grid item xs={10}>
            <StyledTeamNameContainer>
              <BodyText>{homeName}</BodyText>
            </StyledTeamNameContainer>
          </Grid>
          <Grid item xs={2}>
            <StyledOdds>
              <BodyText>{homeOdds}</BodyText>
            </StyledOdds>
          </Grid>
          <Grid item xs={10}>
            <StyledTeamNameContainer>
              <BodyText>{visitorName}</BodyText>
            </StyledTeamNameContainer>
          </Grid>
          <Grid item xs={2}>
            <StyledOdds>
              <BodyText>{visitorOdds}</BodyText>
            </StyledOdds>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: '0.5rem 0' }}>
              <Typography variant="caption">
                {format(new Date(date), 'h:mm a')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </a>
    </Link>
  );

  return (
    <StyledListItemButton disableGutters divider>
      <ListItemAvatar>
        <SportsIcon status={status} sportId={sportId} />
      </ListItemAvatar>
      <StyledListItemText primary={primary} />
    </StyledListItemButton>
  );
};

export default SchedulesListItem;
