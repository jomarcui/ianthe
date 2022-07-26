import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Team } from '../../enums';

const useTeams = (teams) => {
  const home = teams.find(({ team }) => team === Team.Home);
  const visitor = teams.find(({ team }) => team === Team.Visitor);

  return { home, visitor };
};

const Bet = ({ bet: { odds, teams } }) => {
  const { home, visitor } = useTeams(teams);

  return (
    <Stack>
      <Box p={2} sx={{ backgroundColor: 'primary.main' }}>
        <Typography sx={{ color: '#fff' }} variant="body1">
          1 X {odds}
        </Typography>
      </Box>
      <Grid container>
        <TeamGridItem team={home} />
        <TeamGridItem team={visitor} />
      </Grid>
    </Stack>
  );
};

const TeamGridItem = ({ team: { name, team } }) => (
  <Grid
    item
    p={2}
    xs={6}
    sx={{
      borderLeft: team === Team.Visitor && '1px solid #c1d5e3',
    }}
  >
    <Typography align="center" variant="body2">
      {name}
    </Typography>
    <Box m={2} sx={{ textAlign: 'center' }}>
      <Button variant="contained">0</Button>
    </Box>
  </Grid>
);

export default Bet;
