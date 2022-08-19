import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useGetMatchByIdQuery } from '../../redux/api/matchesApi';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import ContainersMatchBetForm from '../../containers/Match/BetForm';

const getQueryId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

const Match: NextPage = () => {
  const [matchId, setMatchId] = useState<string>(null);
  const [openBetForm, setOpenBetForm] = useState<boolean>(false);
  const [scores, setScores] = useState({ home: 10, visitor: 12 });
  const [selectedTeamId, setSelectedTeamId] = useState<string>(null);
  const [skipMatch, setSkipMatch] = useState(true);

  const router = useRouter();

  const { data: match, isLoading: isMatchLoading } = useGetMatchByIdQuery(
    getQueryId(router.query.id),
    { skip: skipMatch }
  );

  useEffect(() => {
    if (router.query.id) {
      setMatchId(getQueryId(router.query.id));
      setSkipMatch(false);
    }
  }, [router.query.id]);

  useEffect(() => {
    const scoresInterval = setInterval(() => {
      const teamNumber = Math.floor(Math.random() * 2);

      if (teamNumber) {
        setScores(({ home, visitor }) => ({
          home,
          visitor: visitor + Math.floor(Math.random() * 2) + 1,
        }));
      } else
        setScores(({ home, visitor }) => ({
          visitor,
          home: home + Math.floor(Math.random() * 2) + 1,
        }));
      {
      }
    }, 5000);

    return () => clearInterval(scoresInterval);
  }, []);

  const handleBetClick = (teamId: string) => {
    setOpenBetForm(true);
    setSelectedTeamId(teamId);
  };

  const handleCloseBetForm = () => setOpenBetForm(false);

  return (
    <Layout>
      <Stack spacing={5} sx={{ bgcolor: '#ecf0f1', my: 3 }}>
        <Box>
          {isMatchLoading && <Loader />}

          {match && (
            <>
              <div>{match.league.name}</div>
              <div>
                <span
                  style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem' }}
                >
                  {match.sport.name}
                </span>
              </div>
            </>
          )}
        </Box>

        <Box>
          {isMatchLoading && <Loader />}

          {match && (
            <Stack direction="row" justifyContent="center" spacing={3}>
              <Box sx={{ maxWidth: 113, minWidth: 100 }}>
                <Paper
                  sx={{
                    mb: 2,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>{scores.home}</span>
                </Paper>
                <Typography align="center" variant="body2">
                  {match.teams.find(({ side }) => side).name}
                </Typography>
              </Box>
              <div style={{ paddingTop: '2rem' }}>vs</div>
              <Box sx={{ maxWidth: 113, minWidth: 100 }}>
                <Paper
                  sx={{
                    mb: 2,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>{scores.visitor}</span>
                </Paper>
                <Typography align="center" variant="body2">
                  {match.teams.find(({ side }) => !side).name}
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>
      </Stack>

      <Stack spacing={2}>
        {isMatchLoading && <Loader />}

        {match &&
          Object.values(match.teams)
            .sort((a, b) => b.side - a.side)
            .map(({ id, name, odds }) => (
              <Card key={id}>
                <CardHeader
                  action={
                    <Button onClick={() => handleBetClick(id)}>
                      Bet &#8369;0.00
                    </Button>
                  }
                  avatar={<Avatar>{name.charAt(0)}</Avatar>}
                  title={name}
                  subheader={odds.toString()}
                />
                {/* <Grid container>
                  <Grid item xs={4}>
                    <div
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        height: '100%',
                      }}
                    >
                      <span style={{ fontSize: '0.875rem' }}>{name}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        height: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      <span>{odds.toString()}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      onClick={() => handleBetClick(id)}
                      variant="outlined"
                      sx={{ width: '100%' }}
                    >
                      Bet: &#8369;0.00
                    </Button>
                  </Grid>
                </Grid> */}
              </Card>
            ))}
      </Stack>

      {matchId && (
        <ContainersMatchBetForm
          handleClose={handleCloseBetForm}
          matchId={matchId}
          open={openBetForm}
          selectedTeamId={selectedTeamId}
        />
      )}
    </Layout>
  );
};

export default Match;
