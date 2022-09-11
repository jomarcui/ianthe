import {
  CellTowerRounded,
  CheckCircleRounded,
  ScheduleRounded,
  ScheduleRounded as ScheduleRoundedIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import Image from 'next/image';
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

  const getMatchChip = ({ status, time }) => {
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

    return (
      <Chip
        color={color}
        label={time || status}
        icon={<Icon color={color} fontSize="small" />}
        size="small"
      />
    );
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
          <Card key={id} sx={{ bgcolor: '#f9f9f9' }}>
            <CardContent>
              <Stack spacing={1}>
                <Stack spacing={1}>
                  <Box textAlign="center">
                    {getMatchChip({
                      status,
                      time:
                        status === Status.Live
                          ? null
                          : format(new Date(date), 'h:mm b'),
                    })}
                  </Box>
                  <Box>
                    <Typography
                      fontSize="small"
                      fontWeight={500}
                      textAlign="center"
                    >
                      {nameHomeTeam}
                    </Typography>
                    <Typography
                      fontSize="small"
                      fontWeight={500}
                      textAlign="center"
                    >
                      {nameVisitorTeam}
                    </Typography>
                  </Box>
                </Stack>
                <Grid container>
                  <Grid item xs={6}>
                    <Stack>
                      <Box textAlign="center">
                        <Image
                          alt={nameHomeTeam}
                          height={50}
                          layout="fixed"
                          src={`/logos/${nameHomeTeam}.png`}
                          width={50}
                        />
                      </Box>
                      <Box px={3} textAlign="center">
                        <Button
                          onClick={(e) => handleBetButtonClick(e, id)}
                          size="small"
                          variant="contained"
                        >
                          Bet
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack>
                      <Box textAlign="center">
                        <Image
                          alt={nameVisitorTeam}
                          height={50}
                          layout="fixed"
                          src={`/logos/${nameVisitorTeam}.png`}
                          width={50}
                        />
                      </Box>
                      <Box px={3} textAlign="center">
                        <Button
                          onClick={(e) => handleBetButtonClick(e, id)}
                          size="small"
                          variant="contained"
                        >
                          Bet
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default TodaysMatchesByLeagueId;
