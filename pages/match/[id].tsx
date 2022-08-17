import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Grid,
  Link as MUILink,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Breadcrumbs } from '@mui/material';
import { useGetMatchByIdQuery } from '../../redux/api/matchesApi';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Loader from '../../components/Loader';
import ContainersBetForm from '../../containers/Match/BetForm';

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
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ bgcolor: '#fff', borderBottom: '1px solid #ecf0f1', p: 2 }}
      >
        <Link href="/" passHref>
          <MUILink color="inherit" underline="hover">
            Today&apos;s Events
          </MUILink>
        </Link>
        <Typography color="text.primary">
          Match ID: {matchId?.slice(0, 8)}...
        </Typography>
      </Breadcrumbs>

      <Stack spacing={5} sx={{ bgcolor: '#ecf0f1', p: 2 }}>
        <Box>
          {isMatchLoading && <Loader />}

          <div>{match?.league.name}</div>
          <div>
            <span style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem' }}>
              {match?.sport.name}
            </span>
          </div>
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
                  {match?.teams.find(({ side }) => side).name}
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
                  {match?.teams.find(({ side }) => !side).name}
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>
      </Stack>

      <List disablePadding sx={{ m: 0 }}>
        {isMatchLoading && <Loader />}

        {match &&
          Object.values(match.teams).map(({ id, name, odds }) => (
            <ListItem divider key={id} sx={{ p: 2 }}>
              {isMatchLoading && <Loader />}

              {match && (
                <Grid container>
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
                </Grid>
              )}
            </ListItem>
          ))}
      </List>

      <ContainersBetForm
        handleClose={handleCloseBetForm}
        matchId={matchId}
        open={openBetForm}
        selectedTeamId={selectedTeamId}
      />
    </Layout>
  );
};

export default Match;
