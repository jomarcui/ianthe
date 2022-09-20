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

  const getTeamNickname = (teamName: string) => {
    const splitTeamName = teamName.split(' ');

    return splitTeamName[splitTeamName.length - 1];
  }

  const homeTeamNickname = getTeamNickname(nameHomeTeam);
  const visitorTeamNickname = getTeamNickname(nameVisitorTeam);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography fontSize="small" textAlign="center">Scores</Typography>
      </Grid>
      <Grid item xs={6}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Image
            alt={nameHomeTeam}
            height={50}
            src={`/logos/${nameHomeTeam}.png`}
            width={50}
          />
          <Typography fontSize="small">{homeTeamNickname}</Typography>
          <Box
            ml="auto !important"
          >
            <Typography fontSize="2rem" fontWeight={500}>
              0
            </Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack alignItems="center" direction="row">
          <Box mr="auto">
            <Typography fontSize="2rem" fontWeight={500}>
              0
            </Typography>
          </Box>
          <Typography fontSize="small" sx={{ mr: 1 }}>{visitorTeamNickname}</Typography>
          <Image
            alt={nameVisitorTeam}
            height={50}
            src={`/logos/${nameVisitorTeam}.png`}
            width={50}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Scoreboard;
