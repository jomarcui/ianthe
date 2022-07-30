import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import styled from '@emotion/styled';
import Layout from '../../components/Layout';
import { useSchedulesQuery } from '../../redux/api/schedulesApi';
import { useTeamsQuery } from '../../redux/api/teamsApi';
import Loader from '../../components/Loader/Loader';
import { Team } from '../../types';

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

const Match: NextPage = () => {
  const router = useRouter();

  const { data: schedules, isLoading: isSchedulesLoading } =
    useSchedulesQuery();

  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();

  const { id } = router.query;

  return (
    <Layout>
      <StyledTitleContainer>
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
      </StyledTitleContainer>
    </Layout>
  );
};

export default Match;
