import {
  CellTowerRounded,
  CheckCircleRounded,
  KeyboardArrowRightOutlined as KeyboardArrowRightOutlinedIcon,
  ScheduleRounded,
  ScheduleRounded as ScheduleRoundedIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { MouseEvent } from 'react';
import { Status } from '../../../enums';
import { useGetMatchesByLeagueIdAndDateQuery } from '../../../redux/api/matchesApi';
import { RoundedButton } from '../../../styledComponents/Buttons';
import { RoundedCard } from '../../../styledComponents/Cards';

const LiveBadgeStyled = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: -1,
      left: -1,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const MatchCardStyled = styled(Card)(({ theme }) => ({
  '& .MuiCardHeader-action': {
    alignSelf: 'inherit',
  },
}));

type TodaysMatchesByLeagueIdProps = {
  leagueId: string;
};

const TodaysMatchesByLeagueId = ({
  leagueId,
}: TodaysMatchesByLeagueIdProps) => {
  const {
    data: getMatchesByLeagueIdAndDateData,
    isLoading: isGetMatchesByLeagueIdAndDateLoading,
  } = useGetMatchesByLeagueIdAndDateQuery(
    {
      date: new Date().toDateString(),
      id: leagueId,
    },
    {
      skip: !leagueId,
    }
  );

  const handleBetButtonClick = (
    _e: MouseEvent<HTMLButtonElement>,
    matchId: string
  ) => Router.push(`/matches/${matchId}`);

  const getMatchChip = ({ status, time }) => {
    const StatusIcon = {
      [Status.Ended]: CheckCircleRounded,
      [Status.Live]: CellTowerRounded,
      [Status.Soon]: ScheduleRounded,
    };

    const IconColor = {
      [Status.Ended]: 'disabled',
      [Status.Live]: 'error',
    };

    const Icon = StatusIcon[status];
    const color = IconColor[status];

    return (
      <Stack alignItems="center" direction="row" spacing={1}>
        <Icon color={color} fontSize="small" />
        <Typography color={color} fontSize="small">
          {time || status}
        </Typography>
      </Stack>
      // <Chip
      //   color={color}
      //   label={time || status}
      //   icon={<Icon color={color} fontSize="small" />}
      // />
    );
  };

  const getMatchStatusAvatar = (status) => {
    if (status === Status.Live)
      return (
        <LiveBadgeStyled
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          overlap="circular"
          variant="dot"
        >
          <Avatar sx={{ bgcolor: '#d32f2f' }}>
            {getMatchStatusIcon(status)}
          </Avatar>
        </LiveBadgeStyled>
      );

    return <Avatar>{getMatchStatusIcon(status)}</Avatar>;
  };

  const getMatchStatusIcon = (status) => {
    const StatusIcon = {
      [Status.Ended]: CheckCircleRounded,
      [Status.Live]: CellTowerRounded,
      [Status.Soon]: ScheduleRounded,
    };

    const Icon = StatusIcon[status];

    return <Icon fontSize="small" />;
  };

  // if no data found and api has finished the request
  if (!getMatchesByLeagueIdAndDateData && !isGetMatchesByLeagueIdAndDateLoading)
    return null;

  // if request was made
  if (isGetMatchesByLeagueIdAndDateLoading)
    return (
      <RoundedCard sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: 3 }}>
        <CircularProgress />
      </RoundedCard>
    );

  const { data: matches } = getMatchesByLeagueIdAndDateData;

  // if no data was found
  if (!matches.length)
    return (
      <RoundedCard sx={{ bgcolor: '#f9f9f9' }}>
        <Box p={3}>
          <Typography>No matches found.</Typography>
        </Box>
      </RoundedCard>
    );

  return (
    <Stack spacing={2}>
      {matches.map(({ date, id, status, teams }) => {
        const {
          odds: oddsHomeTeam,
          team: { name: nameHomeTeam, sportId: sportIdHomeTeam },
        } = teams.find(({ isHome }) => isHome);

        const {
          odds: oddsVisitorTeam,
          team: { name: nameVisitorTeam, sportId: sportIdVisitorTeam },
        } = teams.find(({ isHome }) => !isHome);

        return (
          <MatchCardStyled key={id}>
            <CardHeader
              action={
                <Button
                  sx={{ borderRadius: 28, minWidth: 'initial', p: '6px' }}
                  variant="contained"
                >
                  <KeyboardArrowRightOutlinedIcon />
                </Button>
              }
              avatar={getMatchStatusAvatar(status)}
              subheader={
                <>
                  <Typography fontSize="small" fontWeight={500}>
                    {nameHomeTeam}
                  </Typography>
                  <Typography color="InactiveCaptionText" fontSize="small">
                    vs
                  </Typography>
                  <Typography fontSize="small" fontWeight={500}>
                    {nameVisitorTeam}
                  </Typography>
                </>
                // status === Status.Live
                //   ? Status.Live
                //   : format(new Date(date), 'h:mm b')
              }
              title={
                <Typography fontSize="small" fontWeight="500">
                  {status === Status.Live
                    ? Status.Live
                    : format(new Date(date), 'h:mm b')}
                </Typography>
              }
            />
            {/* <CardContent>
              <Typography fontSize="small" fontWeight={500}>
                {nameHomeTeam}
              </Typography>
              <Typography color="InactiveCaptionText" fontSize="small">
                vs
              </Typography>
              <Typography fontSize="small" fontWeight={500}>
                {nameVisitorTeam}
              </Typography>
            </CardContent> */}
            {/* <CardActions>
              {getMatchChip({
                status,
                time:
                  status === Status.Live
                    ? null
                    : format(new Date(date), 'h:mm b'),
              })}
              <Link href={`/matches/${id}`} passHref>
                <Button
                  component="a"
                  size="small"
                  sx={{ ml: 'auto' }}
                  variant="contained"
                >
                  View
                </Button>
              </Link>
            </CardActions> */}
          </MatchCardStyled>
        );
      })}
    </Stack>
  );
};

export default TodaysMatchesByLeagueId;
