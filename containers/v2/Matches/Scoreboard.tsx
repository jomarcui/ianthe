import { Grid, Stack, Typography, Box } from '@mui/material';
import Image from 'next/image';

type ScoreboardProps = {
  teams: any[];
};

const Scoreboard = ({ teams = [] }: ScoreboardProps) => {
  if (!teams.length) return null;

  const {
    team: { name: nameHomeTeam },
  } = teams.find(({ isHome }) => isHome);
  const {
    team: { name: nameVisitorTeam },
  } = teams.find(({ isHome }) => !isHome);

  return (
    <Grid container>
      <Grid item xs={10}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Image
            alt={nameHomeTeam}
            height={50}
            src={`/logos/${nameHomeTeam}.png`}
            width={50}
          />
          <Typography fontSize="small">{nameHomeTeam}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Box
          alignItems="center"
          display="flex"
          height="100%"
          justifyContent="end"
        >
          <Typography fontSize="1.5rem" fontWeight={500}>
            0
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={10}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Image
            alt={nameVisitorTeam}
            height={50}
            src={`/logos/${nameVisitorTeam}.png`}
            width={50}
          />
          <Typography fontSize="small">{nameVisitorTeam}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Box
          alignItems="center"
          display="flex"
          height="100%"
          justifyContent="end"
        >
          <Typography fontSize="1.5rem" fontWeight={500}>
            0
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Scoreboard;
