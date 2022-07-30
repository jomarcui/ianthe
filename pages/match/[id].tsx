import Link from 'next/link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link as MUILink, Box, Stack, Typography, Grid } from '@mui/material';
import styled from '@emotion/styled';
import Layout from '../../components/Layout';
import { useSchedulesQuery } from '../../redux/api/schedulesApi';
import { useTeamsQuery } from '../../redux/api/teamsApi';
import Loader from '../../components/Loader/Loader';
import { Team } from '../../types';
import { useLeaguesQuery } from '../../redux/api/leaguesApi';
import { useEffect, useState } from 'react';

const StyledTitleContainer = styled(Box)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 1rem;
`;

const getTeamNameById = () => {};

const getTeamsFromMatchId = ({
  id,
  schedules = [],
}): {
  home: { odds: string; teamId: string };
  visitor: { odds: string; teamId: string };
} => schedules.find(({ _id }) => _id === id).teams;

type TeamNamesProps = {
  homeTeamId: string;
  matchId: string;
  teams: Team[];
  visitorTeamId: string;
};

const TeamNames = ({
  homeTeamId,
  matchId,
  teams,
  visitorTeamId,
}: TeamNamesProps) => {
  const { name: homeName } = teams.find(({ _id }) => _id === homeTeamId);
  const { name: visitorName } = teams.find(({ _id }) => _id === visitorTeamId);

  return (
    <Typography align="center" component="h6" variant="h6">
      <Stack>
        <span>{homeName}</span>
        <span>v</span>
        <span>{visitorName}</span>
      </Stack>
    </Typography>
  );
};

const LeagueName = ({ leagueId }: { leagueId: string }) => {
  const { data: leagues, isLoading: isLeaguesLoading } = useLeaguesQuery();

  if (isLeaguesLoading) {
    return <Loader />;
  }

  const { name } = leagues.find(({ _id }) => _id === leagueId);

  return <Typography variant="body1">{name}</Typography>;
};

const Match: NextPage = () => {
  const [leagueId, setLeagueId] = useState<string>(null);
  const router = useRouter();

  const { data: schedules, isLoading: isSchedulesLoading } =
    useSchedulesQuery();

  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

  const { id } = router.query;

  useEffect(() => {
    if (!schedules) return;

    setLeagueId(() => {
      return schedules.find(({ _id }) => _id === id).leagueId;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  return (
    <Layout>
      <Box sx={{ borderBottom: '1px solid #bdc3c7' }}>
        <Stack direction="row">
          <Box
            sx={{
              borderRight: '1px solid #bdc3c7',
              p: 2,
            }}
          >
            <Link href="/" passHref>
              <a
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  height: '100%',
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </a>
            </Link>
          </Box>

          <Box sx={{ alignItems: 'center', display: 'flex', p: 2 }}>
            {leagueId && <LeagueName leagueId={leagueId} />}
          </Box>
        </Stack>
      </Box>
      <Box sx={{ borderBottom: '1px solid #bdc3c7' }}>
        <Box
          sx={{ alignItems: 'center', display: 'flex', minHeight: 100, p: 1 }}
        >
          <Grid container>
            <Grid
              item
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              xs={5}
            >
              {isSchedulesLoading || isTeamsLoading ? (
                <Loader />
              ) : (
                <Typography align="center" variant="body2">
                  {
                    teams.find(
                      ({ _id }) =>
                        _id ===
                        schedules.find(({ _id }) => _id === id).teams.home
                          .teamId
                    ).name
                  }
                </Typography>
              )}
            </Grid>
            <Grid
              item
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              xs={2}
            >
              <Typography variant="body1">3 : 6</Typography>
            </Grid>
            <Grid
              item
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
              xs={5}
            >
              {isSchedulesLoading || isTeamsLoading ? (
                <Loader />
              ) : (
                <Typography align="center" variant="body2">
                  {
                    teams.find(
                      ({ _id }) =>
                        _id ===
                        schedules.find(({ _id }) => _id === id).teams.visitor
                          .teamId
                    ).name
                  }
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ borderBottom: '1px solid #bdc3c7' }}>
        <Stack direction="row" justifyContent="space-evenly">
          {schedules && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">
                <>{schedules.find(({ _id }) => _id === id).teams.home.odds}</>
              </Typography>
            </Box>
          )}

          {schedules && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">
                <>
                  {schedules.find(({ _id }) => _id === id).teams.visitor.odds}
                </>
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
      {/* <StyledTitleContainer>
        {isSchedulesLoading && <Loader />}

        {schedules && (
          <>
            {isTeamsLoading && <Loader />}

            {teams && (
              <TeamNames
                homeTeamId={getTeamsFromMatchId({ id, schedules }).home.teamId}
                matchId={Array.isArray(id) ? id[0] : id}
                teams={teams}
                visitorTeamId={
                  getTeamsFromMatchId({ id, schedules }).visitor.teamId
                }
              />
            )}
          </>
        )}
      </StyledTitleContainer> */}
    </Layout>
  );
};

export default Match;
