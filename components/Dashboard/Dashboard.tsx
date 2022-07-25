import NextLink from 'next/link';
import styled from '@emotion/styled';
import {
  Box,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { LiveTv } from '@mui/icons-material';

enum Team {
  Home,
  Visitor,
}

const GameScreen = styled(Paper)`
  background: url('/David-Beckham-Adidas-Soccer-Wallpaper.jpg');
  background-size: cover;
  border-radius: 2rem;
  overflow: hidden;
  text-align: center;
`;

const LiveMatch = styled.div`
  align-items: center;
  color: #fff;
  display: flex;
  justify-content: center;
`;

const NavigationItem = styled(Box)(({ theme }) => ({
  padding: '1rem',
  textAlign: 'right',
}));

const ScoreText = styled.span`
  color: #fff;
  font-size: 3rem;
`;

const Balance = ({ balance: { amount, currency, history } }) => {
  const amountDisplayed = Number(amount).toFixed(2);

  return (
    <Box
      sx={{
        textAlign: 'center',
        borderRadius: '0.5rem',
        backgroundColor: '#F1C40F',
        padding: '1rem',
      }}
    >
      <Typography component="h5" variant="h5" sx={{ fontSize: '0.75rem' }}>
        CURRENT BALANCE
      </Typography>
      <Typography sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
        &#8369;{amountDisplayed}
      </Typography>
    </Box>
  );
};

const Bet = ({
  bet: {
    amount: { currency, value },
    team,
  },
}: {
  bet: {
    amount: { currency: string; value: Number };
    team: Team;
  };
}) => {
  if (!value) {
    return <div>Place your bet</div>;
  }

  return <div>1</div>;
};

const Score = ({ score: { home, visitor } }) => {
  return (
    <>
      <div>
        <ScoreText>{home}</ScoreText>{' '}
        <span style={{ color: '#fff', fontSize: '2rem' }}>-</span>{' '}
        <ScoreText>{visitor}</ScoreText>
      </div>
      <div style={{ color: '#fff', fontSize: '0.75rem' }}>Score</div>
    </>
  );
};

const TeamCard = ({ team: { name, nickname, src } }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '1rem',
        width: '100%',
      }}
    >
      <Box sx={{ height: 150, position: 'relative' }}>
        <Image alt={name} src={src} layout="fill" />
      </Box>
      <Typography color="text.secondary" my={1}>
        {name}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: '0.625rem' }}>
        {nickname}
      </Typography>
    </Box>
  );
};

const Dashboard = () => {
  const balance = {
    amount: 960,
    currency: 'PHP',
    history: {},
  };

  const bet = {
    amount: {
      currency: null,
      value: 0,
    },
    team: Team.Home,
  };

  const score = {
    home: 4,
    visitor: 2,
  };

  const teams = [
    {
      name: 'Ipswich Town',
      nickname: 'The Blues',
      src: '/ipswich_town_logo.svg',
      team: Team.Home,
    },
    {
      name: 'Sheriff Tiraspol',
      nickname: 'The Yellow-Blacks',
      src: '/sheriff_tiraspol_logo.svg',
      team: Team.Visitor,
    },
  ];

  return (
    <Container maxWidth={false}>
      <Stack spacing={2}>
        <GameScreen>
          <div style={{ background: 'rgba(0,0,0,.3)', padding: '1rem' }}>
            <LiveMatch>
              <span>Live Match</span>
              <LiveTv sx={{ mx: 1 }} />
            </LiveMatch>
            <Grid
              container
              spacing={2}
              sx={{ alignItems: 'center', my: 2, px: 2 }}
            >
              <Grid item xs={4}>
                <TeamCard team={teams[0]} />
              </Grid>
              <Grid item xs={4}>
                <Score score={score} />
              </Grid>
              <Grid item xs={4}>
                <TeamCard team={teams[1]} />
              </Grid>
            </Grid>
          </div>
        </GameScreen>
        <Balance balance={balance} />
        <Bet bet={bet} />
      </Stack>
    </Container>
  );
};

export default Dashboard;
