import Image from 'next/image';
import styled from '@emotion/styled';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Team } from '../../enums';

const BackgroundColorFill = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  height: 25vh;
`;

const Container = styled.div`
  background: url('/david-beckham-adidas-soccer-wallpaper.jpg');
  background-size: cover;
  height: 25vh;
`;

const Scoreboard = ({ scores = [] }) => {
  const home = scores.find(({ team }) => team === Team.Home);
  const visitor = scores.find(({ team }) => team === Team.Visitor);

  return (
    <Container>
      <BackgroundColorFill>
        <Grid container>
          <Grid item xs={4}>
            <TeamInfo team={home} />
          </Grid>
          <Grid alignSelf="center" item xs={4}>
            <Scores scores={scores} />
          </Grid>
          <Grid item xs={4}>
            <TeamInfo team={visitor} />
          </Grid>
        </Grid>
      </BackgroundColorFill>
    </Container>
  );
};

const Scores = ({ scores }) => {
  const { score: homeScore } = scores.find(({ team }) => team === Team.Home);
  const { score: visitorScore } = scores.find(
    ({ team }) => team === Team.Visitor
  );

  return (
    <Box px={4}>
      <Typography
        align="center"
        variant="h6"
        sx={{ border: '1px solid #fff', color: '#fff' }}
      >
        {`${23} - ${16}`}
      </Typography>
    </Box>
  );
};

const TeamInfo = ({ team: { name, nickname, src } }) => (
  <Stack>
    <Typography
      align="center"
      display="block"
      m={2}
      sx={{ color: '#ffffff' }}
      variant="body1"
    >
      {name}
    </Typography>
    <Box sx={{ height: 50, position: 'relative' }}>
      <Image alt={name} src={src} layout="fill" />
    </Box>
  </Stack>
);

export default Scoreboard;
