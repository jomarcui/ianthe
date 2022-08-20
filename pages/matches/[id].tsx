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

const TeamBetCards = ({ handleBetClick, teams = [] }) => (
  <>
    {[...teams]
      .sort((a, b) => b.team.isHome - a.team.isHome)
      .map(({ odds, team: { id, name } }) => (
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
        </Card>
      ))}
  </>
);

const Scoreboard = ({ teams = [] }) => {
  const [scores, setScores] = useState({ home: 10, visitor: 12 });

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
    }, 5000);

    return () => clearInterval(scoresInterval);
  }, []);

  return (
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
          {teams.find(({ isHome }) => isHome).team.name}
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
          {teams.find(({ isHome }) => !isHome).team.name}
        </Typography>
      </Box>
    </Stack>
  );
};

const LeagueInfo = ({
  league: {
    name: leagueName,
    sport: { name: sportName },
  },
}) => (
  <>
    <div>{leagueName}</div>
    <div>
      <span style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem' }}>
        {sportName}
      </span>
    </div>
  </>
);

const Match: NextPage = () => {
  const [matchId, setMatchId] = useState<string>(null);
  const [openBetForm, setOpenBetForm] = useState<boolean>(false);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(null);
  const [skipMatch, setSkipMatch] = useState(true);

  const router = useRouter();

  const {
    data: getMatchByIdResponse,
    isLoading: isGetMatchByIdLoading,
    isUninitialized: isGetMatchByIdUninitialized,
  } = useGetMatchByIdQuery(getQueryId(router.query.id), { skip: skipMatch });

  useEffect(() => {
    if (router.query.id) {
      setMatchId(getQueryId(router.query.id));
      setSkipMatch(false);
    }
  }, [router.query.id]);

  const handleBetClick = (teamId: string) => {
    setOpenBetForm(true);
    setSelectedTeamId(teamId);
  };

  const handleCloseBetForm = () => setOpenBetForm(false);

  return (
    <Layout>
      <Stack spacing={5} sx={{ bgcolor: '#ecf0f1', my: 3 }}>
        <Box>
          {isGetMatchByIdLoading ? (
            <Loader />
          ) : (
            !isGetMatchByIdUninitialized && (
              <LeagueInfo league={getMatchByIdResponse.data.league} />
            )
          )}
        </Box>

        <Box>
          {isGetMatchByIdLoading ? (
            <Loader />
          ) : (
            !isGetMatchByIdUninitialized && (
              <Scoreboard teams={getMatchByIdResponse.data.teams} />
            )
          )}
        </Box>
      </Stack>

      <Stack spacing={2}>
        {isGetMatchByIdLoading ? (
          <Loader />
        ) : (
          !isGetMatchByIdUninitialized && (
            <TeamBetCards
              handleBetClick={handleBetClick}
              teams={getMatchByIdResponse.data.teams}
            />
          )
        )}
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
