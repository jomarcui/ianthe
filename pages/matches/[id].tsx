import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useGetMatchByIdQuery,
  useGetMatchTransactionsByUserIdQuery,
} from '../../redux/api/matchesApi';
import ComponentsLayout from '../../components/Layout';
import Loader from '../../components/Loader';
import ContainersMatchBetForm from '../../containers/Matches/BetForm';
import { RoundedButton } from '../../styledComponents/Buttons';
import { RoundedCard } from '../../styledComponents/Cards';
import ContainersCommonUserActionCard from '../../containers/Common/UserActionCard';
import { Status } from '../../enums';
import {
  AttachMoneyOutlined as AttachMoneyOutlinedIcon,
  CellTowerOutlined as CellTowerOutlinedIcon,
  ScoreboardOutlined as ScoreboardOutlinedIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { LoadingButton } from '@mui/lab';

const getQueryId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

type BetCardProps = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  team: any;
};

const BetCard = ({ handleClick, team }: BetCardProps) => {
  if (!team) return null;

  const {
    odds,
    team: { id, name },
  } = team;

  return (
    <>
      <Card>
        <CardHeader
          action={
            <LoadingButton
              onClick={handleClick}
              size="small"
              value={id}
              variant="contained"
            >
              Bet
            </LoadingButton>
          }
          avatar={
            <Avatar sx={{ height: 32, width: 32 }}>
              <AttachMoneyOutlinedIcon fontSize="small" />
            </Avatar>
          }
          subheader={`Return ${(Number(odds) - 1) * 100}%`}
          title={name}
        />
      </Card>
    </>
  );
};

type BetDialogProps = {
  handleClose: () => void;
  isOpen: boolean;
  team: any;
  title: string;
};

const BetDialog = ({ handleClose, isOpen, team, title }: BetDialogProps) => {
  const [state, setState] = useState({ amount: null });

  useEffect(
    () =>
      setState((prevState) => ({
        ...prevState,
        amount: 20,
      })),
    [team]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));

  const handleFocus = (event: FocusEvent<HTMLInputElement>) =>
    event.target.select();

  const getReturns = ({
    amount = 0,
    odds = 0,
  }: {
    amount: number | string;
    odds: number;
  }) => {
    if (Number.isNaN(amount)) return 0;

    const returnsMultiplier = Number(odds) - 1;

    return Number(amount) * returnsMultiplier + Number(amount);
  };

  if (!team) return null;

  const {
    odds,
    team: { name },
  } = team;

  return (
    <Dialog fullWidth maxWidth="lg" onClose={handleClose} open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form">
          <Stack spacing={1}>
            <Box my={1}>
              <TextField
                placeholder="0.00"
                id="amount-text"
                inputProps={{ step: 0 }}
                label="Amount"
                name="amount"
                onChange={handleChange}
                onFocus={handleFocus}
                required
                type="number"
                value={state.amount}
                variant="outlined"
              />
            </Box>
            <Stack justifyContent="space-between" direction="row" spacing={1}>
              <Typography fontSize="small">Number of bets</Typography>
              <Typography fontSize="small">0</Typography>
            </Stack>
            <Stack justifyContent="space-between" direction="row" spacing={1}>
              <Typography fontSize="small">Odds</Typography>
              <Typography fontSize="small">{`${
                (Number(odds) - 1) * 100
              }%`}</Typography>
            </Stack>
            <Stack justifyContent="space-between" direction="row" spacing={1}>
              <Typography fontWeight={500}>Total Returns</Typography>
              <Typography fontWeight={500}>
                {getReturns({ odds, amount: state.amount })}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" variant="outlined">
          Cancel
        </Button>
        <LoadingButton size="small" variant="contained">
          Place Bet
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

type ScoreboardProps = {
  teams: any[];
};

const Scoreboard = ({ teams = [] }: ScoreboardProps) => {
  if (!teams.length) return null;

  const {
    team: { name: nameHomeTeam },
  } = teams.find(({ isHome }) => isHome);
  const {
    team: { name: nameVisitorTeam },
  } = teams.find(({ isHome }) => !isHome);

  return (
    <Grid container>
      <Grid item xs={10}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Image
            alt={nameHomeTeam}
            height={50}
            src={`/logos/${nameHomeTeam}.png`}
            width={50}
          />
          <Typography fontSize="small">{nameHomeTeam}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Box
          alignItems="center"
          display="flex"
          height="100%"
          justifyContent="end"
        >
          <Typography fontSize="1.5rem" fontWeight={500}>
            0
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={10}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Image
            alt={nameVisitorTeam}
            height={50}
            src={`/logos/${nameVisitorTeam}.png`}
            width={50}
          />
          <Typography fontSize="small">{nameVisitorTeam}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Box
          alignItems="center"
          display="flex"
          height="100%"
          justifyContent="end"
        >
          <Typography fontSize="1.5rem" fontWeight={500}>
            0
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

type StatusAlertProps = {
  config: {
    description: string;
    severity: 'error' | 'info';
  };
};

const StatusAlert = ({ config }: StatusAlertProps) => {
  if (!config) return null;

  const { description, severity } = config;

  return (
    <Alert severity={severity} variant="filled">
      {description}
    </Alert>
  );
};

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

  const router = useRouter();

  const {
    data: getMatchByIdData,
    isFetching: isGetMatchByIdFetching,
    isLoading: isGetMatchByIdLoading,
    isUninitialized: isGetMatchByIdUninitialized,
  } = useGetMatchByIdQuery(getQueryId(router.query.id), { skip: skipMatch });

  const selectedTeam = useTeam({
    teamId: selectedTeamId,
    teams: getMatchByIdData?.data.teams,
  });

  // const matchId = useMemo(() => getQueryId(router.query.id), [router.query.id]);

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
      league: { initialism },
      status,
      teams,
    } = match;

    type StatusAlert = {
      [status in Status]: {
        description: string;
        severity: 'error' | 'info';
      };
    };

    const statusAlert: StatusAlert = {
      [Status.Ended]: {
        description: 'This match has ended.',
        severity: 'error',
      },
      [Status.Live]: null,
      [Status.Soon]: {
        description: 'This match is coming soon.',
        severity: 'info',
      },
    };

    console.log(statusAlert[status]);

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
              subheader={initialism}
              title="Scoreboard"
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
      <Box p={3}>
        <Stack spacing={3}>
          <>
            <ContainersCommonUserActionCard />

            {isGetMatchByIdFetching ||
              (isGetMatchByIdLoading && (
                <Box textAlign="center">
                  <CircularProgress />
                </Box>
              ))}

            {getMatchByIdData && renderMatchCard(getMatchByIdData.data)}

            {teams.map((team, index) => (
              <BetCard handleClick={handleBetClick} key={index} team={team} />
            ))}
          </>
        </Stack>
      </Box>

      {matchId && (
        <BetDialog
          handleClose={handleBetFormDialogClose}
          isOpen={isBetFormDialogOpen}
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
