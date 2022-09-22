import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useGetMatchByIdQuery } from '../../redux/api/matchesApi';
import ComponentsLayout from '../../components/Layout';
import ContainersCommonUserActionCard from '../../containers/Common/UserActionCard';
import { Status } from '../../enums';
import {
  CellTowerOutlined as CellTowerOutlinedIcon,
  ScoreboardOutlined as ScoreboardOutlinedIcon,
} from '@mui/icons-material';
import StatusAlert from '../../containers/v2/Matches/StatusAlert';
import Scoreboard from '../../containers/v2/Matches/Scoreboard';
import BetCard from '../../containers/v2/Matches/BetCard';
import BetDialog from '../../containers/v2/Matches/BetDialog';
import { useGetTransactionByIdQuery } from '../../redux/api/transactionsApi';
import { useSession } from 'next-auth/react';

const getQueryId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

const useTeam = ({
  teamId = null,
  teams = [],
}: {
  teamId: string;
  teams: any[];
}) => teams.find(({ team: { id } }) => id === teamId);

const Match: NextPage = () => {
  const [isBetFormDialogOpen, setIsBetFormDialogOpen] = useState(false);
  const [matchId, setMatchId] = useState<string>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(null);
  const [skipMatch, setSkipMatch] = useState(true);
  const { data: session } = useSession();
  const { data: getTransactionByIdData } = useGetTransactionByIdQuery(
    session?.user['id'],
    {
      skip: !session,
    }
  );

  const router = useRouter();

  const {
    data: getMatchByIdData,
    isFetching: isGetMatchByIdFetching,
    isLoading: isGetMatchByIdLoading,
  } = useGetMatchByIdQuery(getQueryId(router.query.id), { skip: skipMatch });

  const selectedTeam = useTeam({
    teamId: selectedTeamId,
    teams: getMatchByIdData?.data.teams,
  });

  useEffect(() => {
    if (router.query.id) {
      setMatchId(getQueryId(router.query.id));
      setSkipMatch(false);
    }
  }, [router.query.id]);

  const handleBetClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const teamId = event.currentTarget.value;

    setIsBetFormDialogOpen(true);
    setSelectedTeamId(teamId);
  };

  const handleBetFormDialogClose = () => {
    setIsBetFormDialogOpen(false);
  };

  const renderMatchCard = (match: any) => {
    if (!match)
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Match not found.
        </Alert>
      );

    const {
      league: { initialism, sport: { name: sportName } },
      status,
      teams,
    } = match;

    type StatusAlert = {
      [status: string]: {
        description: string;
        severity: 'error' | 'info';
      };
    };

    const statusAlert: StatusAlert = {
      [Status.Ended]: {
        description: 'This match has ended.',
        severity: 'error',
      },
      [Status.Soon]: {
        description: 'This match is coming soon.',
        severity: 'info',
      },
    };

    console.log(getTransactionByIdData)

    return (
      <Box>
        <Stack spacing={3}>
          {status === Status.Live && (
            <Chip
              color="error"
              icon={<CellTowerOutlinedIcon fontSize="small" />}
              label={status}
              size="small"
              sx={{ borderRadius: 1 }}
            />
          )}

          {statusAlert[status] && <StatusAlert config={statusAlert[status]} />}

          <Card>
            <CardHeader
              avatar={<ScoreboardOutlinedIcon />}
              // subheader={initialism}
              title={initialism}
            />
            <CardContent>
              <Scoreboard teams={teams} />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    );
  };

  const homeTeam = getMatchByIdData?.data.teams.find(({ isHome }) => isHome);
  const visitorTeam = getMatchByIdData?.data.teams.find(
    ({ isHome }) => !isHome
  );

  const teams = [homeTeam, visitorTeam];

  return (
    <ComponentsLayout>
      <Box p={3} width="100%">
        <Stack spacing={3}>
          <>
            <ContainersCommonUserActionCard />

            {(isGetMatchByIdFetching || isGetMatchByIdLoading) && (
              <Box textAlign="center">
                <CircularProgress />
              </Box>
            )}

            {getMatchByIdData && renderMatchCard(getMatchByIdData.data)}

            {teams.map((team, index) => (
              <BetCard
                betDisabled={
                  getMatchByIdData?.data.status !== Status.Live || false
                }
                handleClick={handleBetClick}
                matchId={matchId}
                key={index}
                team={team}
              />
            ))}
          </>
        </Stack>
      </Box>

      {matchId && (
        <BetDialog
          handleClose={handleBetFormDialogClose}
          isOpen={isBetFormDialogOpen}
          matchId={matchId}
          team={selectedTeam}
          title={selectedTeam?.team.name}
        />
      )}

      {/* {matchId && (
        <ContainersMatchBetForm
          handleClose={handleCloseBetForm}
          matchId={matchId}
          open={openBetForm}
          selectedTeamId={selectedTeamId}
        />
      )} */}
    </ComponentsLayout>
  );
};

export default Match;
