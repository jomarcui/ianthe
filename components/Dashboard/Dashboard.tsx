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

const GameScreen = styled(Paper)`
  background: url('/David-Beckham-Adidas-Soccer-Wallpaper.jpg');
  background-size: cover;
  border-radius: 2rem;
  text-align: center;
`;

const LiveMatch = styled.h2`
  color: #fff;
`;

const NavigationItem = styled(Box)(({ theme }) => ({
  padding: '1rem',
  textAlign: 'right',
}));

const Score = styled.div`
  color: #fff;
`;

const Dashboard = () => {
  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <NavigationItem>
          <NextLink href="/signout" passHref>
            <Link variant="body2">Sign Out</Link>
          </NextLink>
        </NavigationItem>
        <GameScreen>
          <LiveMatch>Live Match</LiveMatch>
          <Grid container spacing={2} my={2}>
            <Grid item xs={4}>
              <div style={{ color: '#fff' }}>Team 1</div>
            </Grid>
            <Grid item xs={4}>
              <Score>
                <span>4</span> <span>-</span> <span>2</span>
              </Score>
            </Grid>
            <Grid item xs={4}>
              <div style={{ color: '#fff' }}>Team 2</div>
            </Grid>
          </Grid>
        </GameScreen>
      </Stack>
    </Container>
  );
};

export default Dashboard;
