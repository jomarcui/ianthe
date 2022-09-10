import {
  CellTowerRounded,
  CheckCircleRounded,
  ScheduleRounded,
  ScheduleRounded as ScheduleRoundedIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Router from 'next/router';
import { MouseEvent } from 'react';
import { Status } from '../../../enums';
import { useGetMatchesByLeagueIdAndDateQuery } from '../../../redux/api/matchesApi';
import { RoundedButton } from '../../../styledComponents/Buttons';
import { RoundedCard } from '../../../styledComponents/Cards';

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

  const getMatchIcon = (status) => {
    const StatusIcon = {
      [Status.Ended]: CheckCircleRounded,
      [Status.Live]: CellTowerRounded,
      [Status.Soon]: ScheduleRounded,
    };

    const IconColor = {
      [Status.Ended]: 'disabled',
      [Status.Live]: 'error',
      [Status.Soon]: 'info',
    };

    const Icon = StatusIcon[status];
    const color = IconColor[status];

    if (status === Status.Live) {
      return (
        <Chip color={color} icon={<Icon fontSize="small" />} label={status} />
      );
    }

    return <Icon color={color} fontSize="large" />;
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
          team: { name: nameHomeTeam },
        } = teams.find(({ isHome }) => isHome);

        const {
          odds: oddsVisitorTeam,
          team: { name: nameVisitorTeam },
        } = teams.find(({ isHome }) => !isHome);

        return (
          <RoundedCard key={id} sx={{ bgcolor: '#f9f9f9' }}>
            <Grid container>
              <Grid item p={3} xs={7}>
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  height="100%"
                >
                  <Box mb="1rem">
                    <Typography>
                      <strong>Philippine Cup</strong>
                    </Typography>
                    <Typography
                      fontSize="0.75rem"
                      sx={{ color: 'text.secondary' }}
                    >
                      {`${nameHomeTeam} vs ${nameVisitorTeam}`}
                    </Typography>
                  </Box>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    {getMatchIcon(status)}
                    {status !== Status.Live && (
                      <Typography>
                        {format(new Date(date), 'h:mm b')}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Grid>
              <Grid borderLeft="1px solid rgba(0, 0, 0, 0.12)" item xs={5}>
                <Box borderBottom="1px solid #dcdcdc" p={3}>
                  <Stack spacing={1}>
                    <Typography
                      textAlign="center"
                      fontSize="0.75rem"
                      sx={{ color: 'text.secondary' }}
                    >
                      {nameHomeTeam}
                    </Typography>
                    {/* <Typography textAlign="center" fontWeight={500}>
                      {`${oddsHomeTeam}-1`}
                    </Typography> */}
                    <RoundedButton
                      fullWidth
                      onClick={(e) => handleBetButtonClick(e, id)}
                      size="large"
                      variant="contained"
                    >
                      Bet {`${oddsHomeTeam}-1`}
                    </RoundedButton>
                  </Stack>
                </Box>
                <Box p={3}>
                  <Stack spacing={1}>
                    <Typography
                      textAlign="center"
                      fontSize="0.75rem"
                      sx={{ color: 'text.secondary' }}
                    >
                      {nameVisitorTeam}
                    </Typography>
                    {/* <Typography textAlign="center" fontWeight={500}>
                      {`${oddsVisitorTeam}-1`}
                    </Typography> */}
                    <RoundedButton
                      fullWidth
                      onClick={(e) => handleBetButtonClick(e, id)}
                      size="large"
                      variant="contained"
                    >
                      Bet {`${oddsVisitorTeam}-1`}
                    </RoundedButton>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </RoundedCard>
        );
      })}
    </Stack>
  );
};

export default TodaysMatchesByLeagueId;
