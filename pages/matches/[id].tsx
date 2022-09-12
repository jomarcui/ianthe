import { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
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
  team: any;
};

const BetCard = ({ team }: BetCardProps) => {
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [amount, setAmount] = useState('20');

  const handleAmountTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAmount(event.target.value);

  const handleAmountTextFocus = (event: FocusEvent<HTMLInputElement>) =>
    event.target.select();

  const handleBetModalClose = () => setBetModalOpen(false);

  const handleBetModalOpen = () => setBetModalOpen(true);

  const getReturns = ({ amount = 0, odds = 0 }) => {
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
    <>
      <Card>
        <CardHeader
          action={
            <LoadingButton onClick={handleBetModalOpen} variant="contained">
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
      <Dialog
        fullWidth
        maxWidth="lg"
        onClose={handleBetModalClose}
        open={betModalOpen}
      >
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <Box component="form">
            <Stack spacing={1}>
              <Box my={1}>
                <TextField
                  placeholder="0.00"
                  id="amount-text"
                  inputProps={{ step: 0 }}
                  label="Amount"
                  onChange={handleAmountTextChange}
                  onFocus={handleAmountTextFocus}
                  required
                  type="number"
                  value={amount}
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
                  {getReturns({ amount, odds })}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={handleBetModalClose}
            variant="contained"
          >
            Cancel
          </Button>
          <LoadingButton variant="contained">Place Bet</LoadingButton>
        </DialogActions>
      </Dialog>
    </>
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

  return <Alert severity={severity}>{description}</Alert>;
};

const Match: NextPage = () => {
  const [matchId, setMatchId] = useState<string>(null);
  const [openBetForm, setOpenBetForm] = useState<boolean>(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(null);
  const [skipMatch, setSkipMatch] = useState(true);

  const router = useRouter();

  const {
    data: getMatchByIdData,
    isFetching: isGetMatchByIdFetching,
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

          <Card>
            {statusAlert[status] ? (
              <CardHeader
                avatar={<ScoreboardOutlinedIcon />}
                title="Scoreboard"
                subheader={initialism}
              />
            ) : (
              <CardHeader
                title={<StatusAlert config={statusAlert[status]} />}
              />
            )}

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
              <BetCard key={index} team={team} />
            ))}
          </>
        </Stack>
      </Box>

      {matchId && (
        <ContainersMatchBetForm
          handleClose={handleCloseBetForm}
          matchId={matchId}
          open={openBetForm}
          selectedTeamId={selectedTeamId}
        />
      )}
    </ComponentsLayout>
  );
};

export default Match;
