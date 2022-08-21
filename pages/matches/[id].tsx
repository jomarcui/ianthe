import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Avatar,
  Box,
  CardHeader,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  useGetMatchByIdQuery,
  useGetMatchTransactionsByUserIdQuery,
} from '../../redux/api/matchesApi';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import ContainersMatchBetForm from '../../containers/Matches/BetForm';
import { RoundedButton } from '../../styledComponents/Buttons';
import { RoundedCard } from '../../styledComponents/Cards';

const getQueryId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

const TeamBetCards = ({
  handleBetClick,
  matchId,
  isBetFormOpen,
  teams = [],
}) => {
  const { data: session } = useSession();

  const { data: getMatchTransactionsByUserIdResponse, refetch } =
    useGetMatchTransactionsByUserIdQuery(
      {
        id: matchId,
        userId: session?.user['id'],
      },
      { skip: !session }
    );

  useEffect(() => {
    refetch();
  }, [isBetFormOpen, refetch]);

  const betTotal =
    getMatchTransactionsByUserIdResponse?.data.reduce(
      (prevValue, { amount }) => prevValue + Math.abs(amount),
      0
    ) || 0;

  const isBetButtonDisabled = ({ id, transaction }) => {
    if (!transaction) return false;

    return id !== transaction.team;
  };

  console.log(getMatchTransactionsByUserIdResponse);

  return (
    <>
      {[...teams]
        .sort((a, b) => b.team.isHome - a.team.isHome)
        .map(({ odds, team: { id, name } }) => {
          const isBetButtonActive =
            id === getMatchTransactionsByUserIdResponse?.data[0]?.team;

          return (
            <RoundedCard key={id}>
              <CardHeader
                action={
                  <RoundedButton
                    disabled={isBetButtonDisabled({
                      id,
                      transaction:
                        getMatchTransactionsByUserIdResponse?.data[0],
                    })}
                    onClick={() => handleBetClick(id)}
                  >
                    Bet &#8369;
                    {isBetButtonActive ? betTotal.toFixed(2) : '0.00'}
                  </RoundedButton>
                }
                avatar={<Avatar>{name.charAt(0)}</Avatar>}
                title={name}
                subheader={odds.toString()}
              />
            </RoundedCard>
          );
        })}
    </>
  );
};

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
            borderRadius: '2rem',
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
            borderRadius: '2rem',
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
  <Box>
    <Typography>{leagueName}</Typography>
    <Typography style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem' }}>
      {sportName}
    </Typography>
  </Box>
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

  // const matchId = useMemo(() => getQueryId(router.query.id), [router.query.id]);

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

  const handleCloseBetForm = () => {
    setOpenBetForm(false);
    setSelectedTeamId(null);
  };

  return (
    <Layout>
      {isGetMatchByIdLoading ? (
        <Loader />
      ) : (
        !isGetMatchByIdUninitialized && (
          <Stack spacing={5} my={3}>
            <LeagueInfo league={getMatchByIdResponse.data.league} />
            <Scoreboard teams={getMatchByIdResponse.data.teams} />
            <Stack spacing={2}>
              <TeamBetCards
                handleBetClick={handleBetClick}
                matchId={matchId}
                isBetFormOpen={openBetForm}
                teams={getMatchByIdResponse.data.teams}
              />
            </Stack>
          </Stack>
        )
      )}

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
